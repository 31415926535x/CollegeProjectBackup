package servlet;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import DatabaseOperation.DatabaseQuery;
import DatabasesTables.DatabasesIntegration;

/**
 * Servlet implementation class index
 */
@WebServlet("/index")
public class index extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public index() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setCharacterEncoding("UTF-8");
		
		// 首次加载页面将显示所有的数据
		DatabaseQuery dq = new DatabaseQuery("select * from student2;", 1);
		
		ResultSet rs = dq.getResultSet();
		request.setAttribute("rs", rs);
		ResultSetMetaData rsmd = null;
		try {
			rsmd = rs.getMetaData();
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		request.setAttribute("rsmd", rsmd);
		try {
			System.out.println(rsmd.getColumnCount());
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

		// 首次加载页面显示所有可以选择查询的选择项
		
		
		request.getRequestDispatcher("/index/res.jsp").forward(request, response);
		DatabasesIntegration databasesIntegratiion = new DatabasesIntegration();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
