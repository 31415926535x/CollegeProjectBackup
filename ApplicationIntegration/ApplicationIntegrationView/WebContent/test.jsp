<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.util.*,java.sql.*"%>
<%@ page import="javax.servlet.http.*,javax.servlet.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql"%>
 
<html>
	<head>
		<title>SELECT 操作</title>
		
		<!-- 自定义背景色 -->
		<link rel="stylesheet" type="text/css" href="./tmp.css">
		
		<!-- md样式表 -->
		<link rel="stylesheet" href="//cdnjs.loli.net/ajax/libs/mdui/0.4.3/css/mdui.min.css">
		<script src="//cdnjs.loli.net/ajax/libs/mdui/0.4.3/js/mdui.min.js"></script>
	
	
	</head>
	<body>
	
		<div class="mdui-container">
		
			<sql:setDataSource var="snapshot" driver="com.mysql.jdbc.Driver"
			     url="jdbc:mysql://localhost:3306/applicationintegration?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8"
			     user="root"  password="123456"/>
			 
			<sql:query dataSource="${snapshot}" var="result">
			SELECT * from student1;
			</sql:query>
			
			<!--使用md样式表格，设置默认阴影 -->
			<div class="mdui-table-fluid mdui-shadow-10">
				<table class="mdui-table mdui-table-hoverable">
				<tr>
				   <th>学号</th>
				   <th>姓名</th>
				   <th>性别</th>
				   <th>身份证号</th>
				   <th>院系</th>
				   <th>班号</th>
				</tr>
				<c:forEach var="row" items="${result.rows}">
				<tr>
				   <td><c:out value="${row.学号}"/></td>
				   <td><c:out value="${row.姓名}"/></td>
				   <td><c:out value="${row.性别}"/></td>
				   <td><c:out value="${row.身份证号}"/></td>
				   <td><c:out value="${row.院系}"/></td>
				   <td><c:out value="${row.班号}"/></td>
				</tr>
				</c:forEach>
				</table>
			
			</div>
			X
			<sql:query dataSource="${snapshot}" var="result">
			SELECT * from student2;
			</sql:query>
			
			<div class="mdui-table-fluid mdui-shadow-10">
				<table class="mdui-table mdui-table-hoverable">
				<tr>
				   <th>学号</th>
				   <th>名</th>
				   <th>性</th>
				   <th>性别</th>
				   <th>年</th>
				   <th>月</th>
				   <th>日</th>
				   <th>身份证号</th>
				   <th>班级</th>
				</tr>
				<c:forEach var="row" items="${result.rows}">
				<tr>
				   <td><c:out value="${row.nid}"/></td>
				   <td><c:out value="${row.FirstName}"/></td>
				   <td><c:out value="${row.LastName}"/></td>
				   <td><c:out value="${row.sex}"/></td>
				   <td><c:out value="${row.year}"/></td>
				   <td><c:out value="${row.month}"/></td>
				   <td><c:out value="${row.day}"/></td>
				   <td><c:out value="${row.id}"/></td>
				   <td><c:out value="${row.className}"/></td>
				</tr>
				</c:forEach>
				</table>
			</div>
			 
			<button value="put" width="20px" height="10px">put</button>
			
			<br>
			<div>
			<form action="/ApplicationIntegrationView/test" method="get">
				<input name="text" type="text">
			    <input name="hd1" type="hidden" value="数据">
			    <input type="submit" name="ok" value="提交">
			<h1>23333</h1>
			</form>
			</div>
		
		</div>
	 
	
	</body>
</html>