// java code to conform call in emergrncy seervices
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class EmergencyCall extends JFrame implements ActionListener {
    private JButton call911Button;

    public EmergencyCall() {
        super("Emergency Call");
        setSize(300, 150);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        call911Button = new JButton("Call 911");
        call911Button.addActionListener(this);

        JPanel panel = new JPanel();
        panel.add(call911Button);

        add(panel);
        setVisible(true);
    }

    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == call911Button) {
            try {
                // Replace with actual emergency call logic (e.g., using a library like JNA)
                // This is a simplified example
                Desktop.getDesktop().browse(new URI("tel:911")); 
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error making emergency call: " + ex.getMessage());
            }
        }
    }

    public static void main(String[] args) {
        new EmergencyCall();
    }
}