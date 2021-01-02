
# Image Library - Rundown

Most of the work for getting this to function will occur here. To make sure I get the functionality working for both Java and JavaScript, I will probably spawn README's in places where I feel they would be the most helpful. Here will list the useful functions and hopefully chart out the functionality of this class. I will check both sets of functionality at the same time.

New_core will get deleted from the repository once the functionality of the new stuff surpasses the functionality of new_core. This will make sure we are moving forward in a good fashion

Text Image Library is a huge pain in the neck. The time needed to actually draw everything takes time to do making the whole process tedious. Even with all the improvements, it just takes time to draw text into an image and store the image. The way I built the Java version of this thing is also very inefficient, however I'm certain I'll be able to get something off the ground for this in the near future. JavaScript end is working on the fly (which is a lot more important) but lost the ability to be pre-loaded. There is probably some trade off I can do to make both possible. The Java version needs to be redone before I even attempt messing with doing words, paragraphs and sentences. If I was doing all fonts, this would be a done deal already, but the measure of a great product to me is going above and beyond getting the little things to work. I'm devoted to that end completely.

## Useful Functions

### JavaScript

- void ctx.drawImage(image, dx, dy);
- void ctx.drawImage(image, dx, dy, dWidth, dHeight);
- void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

Pretty standard, it grabs a location and the width and height to place an image

### Java

- public abstract boolean drawImage(Image img, int x, int y, ImageObserver observer)
- public abstract boolean drawImage(Image img, int x, int y, int width, int height, ImageObserver observer)
- public abstract boolean drawImage(Image img, int x, int y, Color bgcolor, ImageObserver observer)
- public abstract boolean drawImage(Image img, int x, int y, int width, int height, Color bgcolor, ImageObserver observer)
- public abstract boolean drawImage(Image img, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2, ImageObserver observer)
- public abstract boolean drawImage(Image img, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2, Color bgcolor, ImageObserver observer)

Java2D gives a lot of weird options, like allowing you to determine the background color, as well as handling the images sometimes like JavaScript with the width and the height, and other times as two separate boxes of images. Only time will tell if these two aspects work the same

### Draw

- [x] function placeImg(ctx, num, dlx, dly)
- [x] function drawImg(ctx, num, dlx, dly, dsx, dsy)
- [x] function placeCropImg(ctx, num, dlx, dly, slx, sly)
- [x] function drawCropImg(ctx, num, dlx, dly, dsx, dsy, slx, sly)
- [x] function placeCutImg(ctx, num, dlx, dly, slx, sly, ssx, ssy)
- [x] function drawCutImg(ctx, num, dlx, dly, dsx, dsy, slx, sly, ssx, ssy)

### Picture Text

- [x] function addTextInfo()
- [x] function addTextImage()
- [ ] function addLetterImage()
- [ ] function addWordImage()
- [ ] function addParagraphLineImage()
- [ ] function addParagraphImage()

## Testing Grounds

- ImgLibrary (starts at line 656) [Java]
- JSlix (starts at line 498) [JavaScript]

There are actually differences in how the draw functions work (typical!). For instance, if you place a negative value in Java's destination width or height, it'll draw a flipped image in that direction. But in JavaScript, it'll move the image to the desired location. To deal with this, I'll have all the functionality match the Java way of doing things, with a splash of making sure the positioning is direct.

### Testing Files

- [x] Make a Testing file [Java]
- [x] Make a Testing file [JavaScript]

### Draw functions

- [x] Verify the placeImg functionality is working [Java]
- [x] Verify the drawImg functionality is working [Java]
- [x] Verify the placeCropImg functionality is working [Java]
- [x] Verify the drawCropImg functionality is working [Java]
- [x] Verify the placeCutImg functionality is working [Java]
- [x] Verify the drawCutImg functionality is working [Java]

- [x] Verify the placeImg functionality is working [JavaScript]
- [x] Verify the drawImg functionality is working [JavaScript]
- [x] Verify the placeCropImg functionality is working [JavaScript]
- [x] Verify the drawCropImg functionality is working [JavaScript]
- [x] Verify the placeCutImg functionality is working [JavaScript]
- [x] Verify the drawCutImg functionality is working [JavaScript]

### Text Library Functions

The Java version actually sets a limit in pixels of how far something should go before it can't go anymore. Something that we should most likely emulate in the JavaScript version of the code

- [x] Verify the addTextInfo functionality is working [Java]
- [x] Verify the addTextImage functionality is working [Java]
- [x] Verify the addLetterImage functionality is working [Java]
- [x] Verify the addWordImage functionality is working [Java]
- [x] Verify the addTextLineImage functionality is working [Java]
- [x] Verify the addParagraphImage functionality is working [Java]

The JavaScript version works way differently, first creating an image and pushing it into the main pipeline of images, and then displaying the image as a normal image. I suppose that is okay, but there is a lot more tracking that'll have to take place.

- [x] Verify the addTextInfo functionality is working [JavaScript]
- [x] Verify the addTextImage functionality is working [JavaScript]
- [x] Create the addLetterImage functionality is working [JavaScript]
- [x] Create the addWordImage functionality is added [JavaScript]
- [x] Create the addTextLineImage functionality is added [JavaScript]
- [x] Create the addParagraphImage functionality is added [JavaScript]

So far, really good progress to start the new year. Both versions work the exact same, and the way to draw text is infinitely less clunky than the old way of doing TextImgLibrary. Once all the spacing functionality is in, this will be the defacto JSlix class for all kinds of images.
