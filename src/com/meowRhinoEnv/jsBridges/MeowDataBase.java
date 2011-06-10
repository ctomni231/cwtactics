package com.meowRhinoEnv.jsBridges;

import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * MeowEngine database for providing a persistence local database file. This
 * is designed to be used for meow.storage.
 *
 * <br><br><br>
 * NOTE: This version of MeowDatabase is NOT(!) SQL_Injection safe
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 02.06.2011
 */
public class MeowDataBase extends JsBridge
{
	private Connection connection;

	public MeowDataBase()
	{
		try
		{
			Class.forName("org.apache.derby.jdbc.EmbeddedDriver");
			connection = DriverManager.getConnection("jdbc:derby:rhinoMeowDB;create=true");

			connection.setAutoCommit(true);
			
			DatabaseMetaData dmd = connection.getMetaData();
			ResultSet rs = dmd.getTables(null,"APP", "data",null);
			if (!rs.next()) {
				connection.createStatement().execute("CREATE TABLE DATA(keyStr VARCHAR(50) NOT NULL,value VARCHAR(25000),PRIMARY KEY (keyStr))");
			}
			
		}
		catch (SQLException ex)
		{
			//Logger.getLogger(MeowDataBase.class.getName()).log(Level.SEVERE, null, ex);
		}
		catch (ClassNotFoundException ex)
		{
			//Logger.getLogger(MeowDataBase.class.getName()).log(Level.SEVERE, null, ex);
		}

	}

	public void jsFunction_setItem( String key, String val )
	{
		update(	  "DELETE FROM data WHERE keyStr = '"+key+"' ");
		update( "INSERT INTO data (keyStr,value) VALUES('"+key+"','"+val+"')");
	}

	public String jsFunction_getItem( String key )
	{
		String res = null;
		try
		{
			Statement st = null;
			ResultSet rs = null;
			st = connection.createStatement();

			rs = st.executeQuery("SELECT value FROM data WHERE keyStr='"+key+"'");
			rs.next();
			res = rs.getString("value");

			st.close();
		}
		catch (SQLException ex)
		{
			
		}

		return res;
	}

	public void jsFunction_removeItem( String key )
	{
		update("DELETE FROM data WHERE keyStr = '"+key+"'");
	}

	public String jsFunction_keySet( )
	{
		StringBuilder b = new StringBuilder("[");
		
		try
		{
			Statement st = null;
			ResultSet rs = null;
			st = connection.createStatement();

			rs = st.executeQuery("SELECT keyStr FROM data");
			while (rs.next())
			{
				if( b.length() > 1 ) b.append(",");
				b.append("\"").append(rs.getString("key")).append("\"");
			}

			st.close();
		}
		catch (SQLException ex)
		{
			Logger.getLogger(MeowDataBase.class.getName()).log(Level.SEVERE, null, ex);
		}
		
		b.append("]");
		return b.toString();
	}

	public void jsFunction_clear( )
	{
		update("DELETE FROM data WHERE 1=1");
	}

    private void update(String expression)
	{
		try
		{
			Statement st = null;
			st = connection.createStatement(); // statements
			int i = st.executeUpdate(expression);
			
			if (i == -1)
			{
				System.out.println("db error : " + expression);
			}
			st.close();
		}
		catch (SQLException ex)
		{
			Logger.getLogger(MeowDataBase.class.getName()).log(Level.SEVERE, null, ex);
		}
    } 
}
