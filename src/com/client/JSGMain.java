package com.client;

import com.client.screen.MainMenuScreen;
import com.jslix.system.SlixGame;
import com.jslix.system.SlixLibrary;
import org.newdawn.slick.AppGameContainer;
import org.newdawn.slick.SlickException;

/**
 * JSGMain
 * 
 * This is the JSlix version of the program, it also helps display a
 * Slick applet
 *
 *@author Carr, Crecen
 *@version 09.12.10
 *@license  New BSD License
 *	Copyright (c) 2010, BearWolf/Exotec
 *	Exotec label holder is Radom Alexander, blackcat.myako@gmail.com
 *	BearWolf label holder is Carr, Crecen, scarr231@yahoo.com
 *	All rights reserved.
 *
 *	Redistribution and use in source and binary forms, with or without 
 *      modification, are permitted provided that the following conditions
 *      are met:
 *
 *	1)	Redistributions of source code must retain the above copyright
 *              notice, this list of conditions and the following disclaimer.
 *
 *	2)	Redistributions in binary form must reproduce the above
 *              copyright notice, this list of conditions and the following
 *              disclaimer in the documentation and/or other materials
 *              provided with the distribution.
 *
 *	3)	Neither the name of the Exotec/BearWolf nor the names of its 
 *              contributors may be used to endorse or promote products derived
 *              from this software without specific prior written permission.
 *
 *	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 *	ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 *	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 *	IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 *	INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
 *	NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
 *	OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 *	LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 *	OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 *	OF THE POSSIBILITY OF SUCH DAMAGE.
 */

public class JSGMain extends SlixGame{

    public static void main(String[] args){
        try{
            AppGameContainer app = new AppGameContainer(new JSGMain());

            //YOU MAY SET NEW SIZE VALUES FOR THE APPLET HERE
            //Make sure you match them in the .html, or it won't work.
            //app.setDisplayMode( 480, 320, false );
            app.setDisplayMode( 640, 480, false );
            app.start();
        } catch ( SlickException e ) {
            e.printStackTrace();
        }
    }

    @Override
    public void loadGame(){
        //DO ALL YOUR INITIALIZATIONS FOR YOUR SCREENS HERE!!!
        SlixLibrary.addFrameScreen(new MainMenuScreen());
        //Make sure you use SlixLibrary to add the Screens
        //Also a good place to do all the initialzation stuff
    }
}
