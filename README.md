# A Modern Feature Rich Model Viewer

3D models are becoming more and more revelant every year. Online stores are using 3d models to show off products, museums are making entire virtual buildings to be viewed online and libraries are archiving physical objects as 3d models. Unfortuanatley it can be hard to add a 3d model viewer to a website. That is where the HBLL Model Viewer comes in. Developed at the Brigham Young University's experiental lab, this model viewer is feature rich to bring a 3d viewer that can easily be embeded into any website. The focus is on providing an easy way to annotated and display annotated models for educational purposes.

## How it works

There are two major aspects of this model viewer. The first part is the annotating of models, this involes uploading a model then adding annotations and background. The project can then be downloaded as a zip file containg all the needed data to display the model and the annotations. The second part is a pure viewer, capable of reading the data and displaying the model and the annotations.

## Edit the model

To prepare a model with annotations, first go to this link [Model Viewer Editor](https://www.modelviewer.justbrenkman.com/viewer/example).

### Upload the model

To upload the model simply drag and drop the model file onto the screen. We currently only accept .glb models, these models contain all the data and images needed to display the model. Almost all major 3d modelling software support .glb and many will even convert the models into .glb for you.

### Add annotations

Adding annotations are simple, click on the edit icon on the button of your screen. A popup that is titled `Edit` will pop up. To add an annotation click on the `Add Annotation` button then click on the model where you want the annotation added. An annotion will appear on the model with a number. That number is the order in which the annotation is viewed. On the `Edit` panel you will see the same annotation appear in a list.

You can add as many annotations as you would like. You can name annotations by clicking on the item in the list and typing in a new name, you can also change the color of the annotation by clicking on the small white scquare next to the name. By default the color is white, but you can make it any color you would like, once you have picked the color you like click on the `save` button then click again anywhere on the screen to dismiss the color picker.

Annotations can also be rearranged so that when using the navigator they are ordered. Once you have more than one annotation you can simply grab the annotation you want to reorder from the list in the `Edit` panel and drag it into the position you would like it to be. You will notice that the numbers on the model will update to show the new order.

Annotations also have descriptive texts that describe what the point is about. To change the text click on the annotation that is on the model. A popup next to the annotation will appear, you can edit the text inside it to display whatever information you would like. We use a langauge called markdown to add Headings, text, links and lists. You can use this website [showdown editor](http://demo.showdownjs.com/) to make the text appear as you would like then copy the markdown into the popup.

### Background

You can also add a background to the model, we use .hdr images to make an environment around the model. You can find many websites that offer free hdr backgrounds. We like to use [HDRiHaven](https://hdrihaven.com/), find an environment that you like and download it(1k is fine). Afterwards drag and drop the file onto the screen and you will see the background appear.

### Preview

To preview the annotated model click on the edit button on the bottom of your screen again to dismiss the `Edit` panel. You can then use the annotation navigation on the bottom center of your screen (click on the arrows) to go throught the annotaitons. Or you can directly click on the annotations to view what they say.

### Download model

Once you are done editing the model you can download it so that it can be used in a viewer. To download simply press the download icon next to the `Edit` text. Send us the model and then we can send you a link that displays the model.
