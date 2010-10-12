package com.client.state;

import com.jslix.tools.TextImgLibrary;
import com.system.reader.MenuReader;
import org.newdawn.slick.Graphics;

/**
 * Will hold the Map Editor
 * @author Crecen
 */
public class MapEditorState extends SlickScreen{

    private TextImgLibrary txtLib;
    private MenuReader reader;

    public MapEditorState(){
        reader = new MenuReader("data/editmenu.xml");
        initText();
    }

    @Override
    public void init() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    private void initText(){
        txtLib = new TextImgLibrary();
        txtLib.addImage(reader.getAlpha());
        txtLib.addAllCapitalLetters(txtLib.getImage(0), "", 6, 5, 0);
        txtLib.addLetter('-', txtLib.getImage(0), "", 6, 5, 29);
        txtLib.addLetter('\'', txtLib.getImage(0), "", 6, 5, 28);
        txtLib.addLetter(',', txtLib.getImage(0), "", 6, 5, 27);
        txtLib.addLetter('.', txtLib.getImage(0), "", 6, 5, 26);
    }

    @Override
    public void render(Graphics g) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void update(int timePassed) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

}
