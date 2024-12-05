package krgz.layer;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LayerService {

    public List<String> getNonNullColumns() {
        List<String> nonNullColumns = new ArrayList<>();
        String queryAllColumns = "SELECT column_name FROM information_schema.columns WHERE table_name = 'issyk_ata' AND table_schema = 'data'";

        try (Connection connection = DatabaseConfig.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(queryAllColumns)) {

            while (resultSet.next()) {
                String column = resultSet.getString("column_name");
                String queryNonNullCheck = "SELECT EXISTS (SELECT 1 FROM data.issyk_ata WHERE " + column + " IS NOT NULL)";
                
                try (Statement checkStatement = connection.createStatement();
                     ResultSet checkResultSet = checkStatement.executeQuery(queryNonNullCheck)) {
                    if (checkResultSet.next() && checkResultSet.getBoolean(1)) {
                        nonNullColumns.add(column);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return nonNullColumns;
    }

    public List<Map<String, Object>> getDataWithNonNullColumns(List<String> columnNames) {
        List<Map<String, Object>> data = new ArrayList<>();
        if (columnNames.isEmpty()) {
            return data;
        }

        // 쿼리 생성
        String query = "SELECT " + String.join(", ", columnNames) + " FROM data.issyk_ata";

        try (Connection connection = DatabaseConfig.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(query)) {

            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<>();
                for (String column : columnNames) {
                    row.put(column, resultSet.getObject(column));
                }
                data.add(row);  // 여기에 Map<String, Object>를 추가합니다
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return data;
    }

    public static void main(String[] args) {
        LayerService service = new LayerService();
        List<String> nonNullColumns = service.getNonNullColumns();
        System.out.println("NonNull Columns: " + nonNullColumns);

        List<Map<String, Object>> data = service.getDataWithNonNullColumns(nonNullColumns);
        System.out.println("Data: " + data);
    }
}
