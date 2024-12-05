package krgz.layer;

import com.fasterxml.jackson.databind.ObjectMapper;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/layer/selectExistColumn.do")
public class LayerServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private final LayerService layerService = new LayerService(); // 실제 서비스 객체를 주입해야 함

    private final ObjectMapper objectMapper = new ObjectMapper(); // Jackson ObjectMapper

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getParameter("action");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        if ("nonnull-columns".equals(action)) {
            List<String> nonNullColumns = layerService.getNonNullColumns();
            String jsonResponse = objectMapper.writeValueAsString(nonNullColumns);
            resp.getWriter().write(jsonResponse);
        } else if ("data-with-nonnull-columns".equals(action)) {
            List<String> nonNullColumns = layerService.getNonNullColumns();
            List<Map<String, Object>> data = layerService.getDataWithNonNullColumns(nonNullColumns);
            String jsonResponse = objectMapper.writeValueAsString(data);
            resp.getWriter().write(jsonResponse);
        } else {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"Invalid action parameter\"}");
        }
    }
}
