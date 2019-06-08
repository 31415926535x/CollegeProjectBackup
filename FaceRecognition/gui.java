import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;
import javax.swing.*;

public class gui {

    static Process process;
    static JFrame frame = new JFrame("FaceRecognization");
    
    static JTextArea ta = new JTextArea(30, 50);
    static JPanel p1 = new JPanel();
    
    static JButton b0 = new JButton("Init");
    static JButton b1 = new JButton("CollectFaces");
    static JButton b2 = new JButton("TrainModel");
    static JButton b3 = new JButton("Tensorboard");
    static JButton b4 = new JButton("RTTest");


	public static void main(String[] args) {
        // TODO Auto-generated method stub
        
        frame.setSize(1024, 800);
        frame.setLocation(200, 200);    
        frame.setLayout(new FlowLayout());

        ta.setPreferredSize(new Dimension(800,700));    //ta size
        ta.setLineWrap(true);
        // p1.add(ta);
        JScrollPane jsp = new JScrollPane(ta);
        jsp.setSize(2, 2);
        // jsp.setBounds(800, 200, 600, 60);
        jsp.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);

        frame.add(b0);
		frame.add(b1);
        frame.add(b2);
        frame.add(b3);
        frame.add(b4);
        frame.add(jsp);
        frame.add(p1);
        
        b0.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					String line;
					String cmd = "G:\\DIP\\Anaconda3\\envs\\test1\\python.exe G:\\DIP\\mine\\init.py & exit";
					//cmd += name;
					Process process = Runtime.getRuntime().exec(cmd);
                    
                    new Thread(new StreamDrainer(process.getInputStream())).start();
                    new Thread(new StreamDrainer(process.getErrorStream())).start();
                    process.getOutputStream().close();


					System.out.println(process.waitFor());
					//System.out.println(process.waitFor());
				} catch (Exception e2) {
					System.out.println("error: " + e2);
				}
				
			}
        });
		b1.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					String line;
					String cmd = "cmd /k start G:\\DIP\\Anaconda3\\envs\\test1\\python.exe G:\\DIP\\mine\\getFaceByCamera.py & exit";
					//cmd += name;
					Process process = Runtime.getRuntime().exec(cmd);

                    new Thread(new StreamDrainer(process.getInputStream())).start();
                    new Thread(new StreamDrainer(process.getErrorStream())).start();
                    process.getOutputStream().close();
					
					System.out.println(process.waitFor());
				} catch (Exception e2) {
					System.out.println("error: " + e2);
				}
				
			}
        });
        b2.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    String cmd = "G:\\DIP\\Anaconda3\\envs\\test1\\python.exe G:\\DIP\\mine\\tensorflow_face.py & exit";
                    Process process = Runtime.getRuntime().exec(cmd);


                    new Thread(new StreamDrainer(process.getInputStream())).start();
                    new Thread(new StreamDrainer(process.getErrorStream())).start();
                    process.getOutputStream().close();

                    ta.setText("");
                    ta.append("Waiting for launching tensorflow environment to start Face Recognition Training.....\n");
                    
                    System.out.println(process.waitFor());
                } catch (Exception e2) {
                    System.out.println("error: " + e2);
                }
                
            }
        });
        b3.addActionListener(new ActionListener() {
            /*
                this button word for launching ternsorboard...
            */
            @Override 
            public void actionPerformed(ActionEvent e) {
                try {
                    // there is a bug, which is that you may need to shutdown this application after launth tensorboard
                    // update: you don't need to shutdown this application, but the tensorboard always run...
                    String cmd = "G:\\DIP\\Anaconda3\\envs\\test1\\Scripts\\tensorboard.exe --logdir=./tmp";
                    // String cmd = "G:\\DIP\\Anaconda3\\envs\\test1\\python.exe G:\\DIP\\mine\\tensorflow_face.py & exit";
                    // String cmd = "cmd /k g++ test.cpp -o test.exe & test.exe & exit";
                    Process process = Runtime.getRuntime().exec(cmd);


                    new Thread(new StreamDrainer(process.getInputStream())).start();
                    new Thread(new StreamDrainer(process.getErrorStream())).start();
                    process.getOutputStream().close();
                    
                    ta.setText("");
                    ta.append(cmd);
                    ta.append("\n");
                    ta.append("Waiting for launch tensorboard....\n");
                    ta.append("If you wanna quit, you may need to shutdown this application for this version.....\n");

                    // System.out.println(process.waitFor());
                } catch (Exception e2) {
                    System.out.println("error: " + e2);
                }
                
            }
        });
		b4.addActionListener(new ActionListener() {
					
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    String cmd = "G:\\DIP\\Anaconda3\\envs\\test1\\python.exe G:\\DIP\\mine\\tensorflow_face.py & exit";
                    Process process = Runtime.getRuntime().exec(cmd);


                    new Thread(new StreamDrainer(process.getInputStream())).start();
                    new Thread(new StreamDrainer(process.getErrorStream())).start();
                    process.getOutputStream().close();

                    ta.setText("");
                    ta.append("Waiting for launching tensorflow environment to start Face Recognition.....\n");
                    ta.append("Please face to camera....\n");
                    
                    System.out.println(process.waitFor());
                } catch (Exception e2) {
                    System.out.println("error: " + e2);
                }
                
            }
        });
				
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        frame.setVisible(true);
	}

}

class StreamDrainer implements Runnable {
    private InputStream ins;

    public StreamDrainer(InputStream ins) {
        this.ins = ins;
    }

    public void run() {
        try {
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(ins));
            String line = null;
            int i = 0;
            while ((line = reader.readLine()) != null) {
                ++i;
                if(i == 33){
                    i = 0;
                    gui.ta.setText("");
                }
                line += '\n';
                System.out.println(line);
                // System.out.flush();
                gui.ta.append(line);
                gui.ta.paintImmediately(gui.ta.getBounds());
                
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
