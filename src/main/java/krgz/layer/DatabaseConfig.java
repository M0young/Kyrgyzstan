package krgz.layer;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConfig {

    private static String url;
    private static String username;
    private static String password;
    private static String driverClassName;

    static {
        // 프로퍼티 파일 로드
        Properties properties = new Properties();
        try (InputStream input = DatabaseConfig.class.getClassLoader().getResourceAsStream("egovframework/egovProps/globals-dev.properties")) {
            if (input == null) {
                System.out.println("Sorry, unable to find globals-dev.properties");
            }
            // 프로퍼티 파일에서 값을 읽어오기
            properties.load(input);
            url = properties.getProperty("Globals.postgresql.url");
            username = properties.getProperty("Globals.postgresql.username");
            password = properties.getProperty("Globals.postgresql.password");
            driverClassName = properties.getProperty("Globals.postgresql.DriverClassName");
            
            Class.forName(driverClassName);

        } catch (IOException | ClassNotFoundException ex) {
            ex.printStackTrace();
        }
    }

    // 데이터베이스 연결 메서드
    public static Connection getConnection() throws SQLException {
        if (url == null || url.isEmpty()) {
            throw new SQLException("The url cannot be null");
        }
        return DriverManager.getConnection(url, username, password);
    }

    public static void main(String[] args) {
        try (Connection connection = DatabaseConfig.getConnection()) {
            if (connection != null) {
                System.out.println("Connected to the database!");
            } else {
                System.out.println("Failed to make connection!");
            }
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.getMessage());
        }
    }
}
