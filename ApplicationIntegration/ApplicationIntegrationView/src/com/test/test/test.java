package com.test.test;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import DatabaseOperation.DatabaseQuery;

/**
 * Servlet implementation class test
 */
@WebServlet("/test")
public class test extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public test() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {		
		// TODO Auto-generated method stub
		response.setCharacterEncoding("UTF-8");
		DatabaseQuery dq = new DatabaseQuery("select * from student2 where sex=\"F\"", 1);
		
		
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().print("<!DOCTYPE html> \n");
        String title = "get id";
        response.getWriter().print("<html>\n" + "<head><title>" + title + "</title></head>\n");
        response.getWriter().print("<body>" + "<table border=\"1\" width=\"100%\">\r\n");
        response.getWriter().print("<tr>");
        response.getWriter().print("<th>" + "nid" + "</th>");
        response.getWriter().print("<th>" + "id" + "</th>");
        response.getWriter().print("</th>");
		ResultSet rs = dq.getResultSet();
		response.getWriter().print("\n");
		try {
			while(rs.next()) {
				response.getWriter().print("<tr>");
				response.getWriter().println("<td>" + rs.getObject("nid") + "</td>\n" + "<td>" + rs.getObject("id") + "</td>");
				response.getWriter().println("</tr>");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		response.getWriter().println("</table>");

		String key = request.getParameter("text");
		String sql = "select * from student1 where 性别=\"" + key + "\";";
		dq = new DatabaseQuery(sql, 0);
		rs = dq.getResultSet();
		response.getWriter().print("<h1>" + sql + "</h1>");
        response.getWriter().print("<table border=\"1\" width=\"100%\">\r\n");
		response.getWriter().print("<tr><th>学号</th>" + "<th>姓名</th>" + "<th>性别</th>" + "<th>身份证号</th>" + "<th>班级</th></th>");
		try {
			while(rs.next()) {
				response.getWriter().print("<tr>");
				response.getWriter().print("<td>" + rs.getObject("学号") + "</td>\n" + "<td>" + rs.getObject("姓名") + "</td>" + "<td>" + rs.getObject("性别") + "</td>");
				response.getWriter().print("<td>" + rs.getObject("身份证号") + "</td>" + "<td>" + rs.getObject("院系") + rs.getObject("班号") + "</td>");
				response.getWriter().print("</tr>");
			}
		} catch (SQLException e) {
			// TODO: handle exception
		}
		response.getWriter().print("</table>");
		response.getWriter().println("</body>");
		
		
		
	}
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}

// sql dirver???????

