this.Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");
// Documents es como lo encontramos en nuestra app, y documentos como lo referimos dentro de Mongo


if (Meteor.isClient) {

//Update the sessions.	
// Meteor.setInterval(function(){
// Session.set("current_date", new Date());	
// },1000);

// Template.date_display.helpers({
// current_date:function(){
// 	return Session.get("current_date");

// }
// });	

Template.editor.helpers({
	docid:function(){
		console.log("doc id helper");
		console.log(Documents.findOne());
		var doc = Documents.findOne();
		if(doc){
			return doc._id;
		}
		else{
			return undefined;
		}
		},
		 config:function(){
		 	return function(editor){
		 		editor.setOption("lineNumbers",true);
		 		editor.setOption("mode","html");
		 		editor.on("change",function(cm_editor,info){
		 			$("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
		 			Meteor.call("addEditingUsers");
		 		});
		 		}
		 },
		});
	}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // startup code that creates a document in case there isn't one yet. 
    if (!Documents.findOne()){ //no documents yet
    	Documents.insert({title:"my new document"});
    }
  });
}

Meteor.methods({
	addEditingUsers:function(){
		var doc, user, eusers;
		doc = Documents.findOne();
		if(!doc){return;}//no doc, give up
		if(!this.userId){return;} //no logged in user giveup
		// now i have a doc and an user
		user = Meteor.user().profile;
		eusers= EditingUsers.findOne({docid:doc._id});
		if(!eusers){
			eusers= {
				docid:doc._id,};
		}
		EditingUsers.insert(eusers);
	}
})
