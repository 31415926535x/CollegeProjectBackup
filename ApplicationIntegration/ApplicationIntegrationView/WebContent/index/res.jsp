<%@page import="java.sql.ResultSetMetaData"%>
<%@page import="java.sql.ResultSet"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql"%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>ApplicationIntegrationIndex</title>
		<link rel="shortcut icon" href="#" />
	
		<!-- mdui样式表 -->
		<link rel="stylesheet" href="//cdnjs.loli.net/ajax/libs/mdui/0.4.3/css/mdui.min.css">
		<script src="//cdnjs.loli.net/ajax/libs/mdui/0.4.3/js/mdui.min.js"></script>
		
		<!-- 自定义背景色 -->
		<link rel="stylesheet" type="text/css" href="./css/index.css">


		<!-- jquery -->
		<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>

		<!-- 查询的结果由 get-qryres.js 得到并重新绘制页面 -->
		<!-- 因为key-select会调用get-qryres中的方法，所以要前置 -->
		<script src="./js/get-qryres.js"></script>

		<!-- 查询选择区域的显示由 key-select.js 完成 -->
		<script src="./js/key-select.js"></script>

		<!-- 删除某一个元素 -->
		<script src="./js/delete.js"></script>
		



	</head>
	<body>
		<div>
			<div class= "mdui-container">

				<!-- 数据库的每一个字段的选择区域 -->
				<!-- 首次加载页面时将显示所有可以选择的项目 -->
				<!-- 此后的每一次查询都将重新请求，刷新可选项 -->
				<div class="mdui-talbe-fluid mdui-shadow-10" id="key-select">
					<form id="keysSelectForm">

						
					</form>
				</div>

				<!-- 结果的显示区域 -->
				<!-- 第一次加载页面时显示数据库中所有数据 -->
				<!-- 此后的每一次查询，采用ajax的异步请求实现页面的局部区域的刷新（即不使用jsp+servlet模式） -->
				<div class="mdui-table-fluid mdui-shadow-10" id="get-qryres">
					
					<table class="mdui-table mdui-talbe-hoverable">
					
					<%
						%><tr><%
						ResultSet rs = (ResultSet)request.getAttribute("rs");
						ResultSetMetaData rsmd = (ResultSetMetaData)request.getAttribute("rsmd");
						String colVal = null;
						int len = rsmd.getColumnCount();
						for(int i = 1; i <= len; ++i){
							colVal = rsmd.getColumnName(i);
							%><th><%=colVal %></th><%
						}
						
						%><th>
							全选删除
						</th><%
						%></tr><%
						
						while(rs.next()){
							%><tr><%
							
							for(int i = 1; i <= len; ++i){
								colVal = rs.getString(i);
								%><td><%=colVal %></td><%
							}
							
							%><th>
							<label class="mdui-checkbox">
								<input type="checkbox"/>
								<i class="mdui-checkbox-icon"></i>
								选中删除
							</label>
						</th><%
							
							%></tr><%
						}
					%>
					
					
					</table>
					
				</div>
			
			</div>
		
		</div>
	</body>
</html>