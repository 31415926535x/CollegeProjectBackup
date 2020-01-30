package servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import DatabaseOperation.DatabasesKeysSelect;

/**
 * Servlet implementation class KeysSelect
 */

    /**
    * @ClassName: KeysSelect
    * @Description: 一个获取可选择项的servlet
    * @author 31415926535x
    * @date 2019年12月20日
    *
    */
    
@WebServlet("/KeysSelect")
public class KeysSelect extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public KeysSelect() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
//		response.getWriter().append("Served at: ").append(request.getContextPath());
		response.setContentType("application/json; charset=utf-8");
        response.setHeader("cache-control", "no-cache");
        PrintWriter out = response.getWriter();
        System.out.println((new DatabasesKeysSelect(0, "1")).getKeysSelect());
        try {
			out.print((new DatabasesKeysSelect(0, "1")).getKeysSelect());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
