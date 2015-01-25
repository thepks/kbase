guidesController = function() {
	var guidesPage;
	var initialised = false;
	var manage = false;
	var online = true;
	var pouch;
	var url = '/kbase';
	var searchUrl1 = '/kbase/_design/kb/_search/keywords?q=description:';
  var searchUrl2 = '%20OR%20title:';
  var searchUrl3 = '&include_docs=true';

	return {
		init : function(page) {
			if (!initialised) {
				guidesPage = page;
				PouchDB.destroy('kbase_local');

        console.log('Initialising');
				$(guidesPage).find('#homeEvt').click(function(evt) {
				  console.log('In event');
					evt.preventDefault();
					$(guidesPage).find('#home').parent().siblings().children('div').hide();
					if (manage) {
					  manage = !manage;
					}
				});

				$(guidesPage).find('#manageEvt').click(function(evt) {
				  console.log('In event manage');
				  manage = ! manage;
					evt.preventDefault();
					$(guidesPage).find('#manage').slideToggle("slow");
					$(guidesPage).find('.editNav').slideToggle("fast");
					$(guidesPage).find('#manageTable').find('input').val('');
					$(guidesPage).find('#newSubmit').val('Save');

				});

				$(guidesPage).find('#pouchEvt').click(function(evt) {
				  console.log('Switching Mode');
				  evt.preventDefault();
				  online = ! online;

				  if (online) {
				    $(guidesPage).find('#pouchEvt').removeClass('menuOffline');
				    $(guidesPage).find('#pouchEvt').addClass('menuOnline');
				    $(guidesPage).find('#pouchEvt').text('ONLINE');
				  } else {
				    $(guidesPage).find('#pouchEvt').removeClass('menuOnline');
				    $(guidesPage).find('#pouchEvt').addClass('menuOffline');
				    $(guidesPage).find('#pouchEvt').text('OFFLINE');
				    pouch = new PouchDB('kbase_local');
            var myIndex = {
              _id: '_design/my_index',
              views: {
                'my_index': {
                  map: function (doc) {
                    if(doc.title) {
                      emit(doc.title.toUpperCase());
                    }

                  }.toString()
                }
              }
            };
            // save it
            pouch.put(myIndex).then(function (info) {
              // kick off an initial build, return immediately
              return pouch.query('my_index', {stale: 'update_after'});
            }).catch(function(err) {
              console.log(err);
            });



				  }

				  $(guidesPage).find('#pouchEvt').blur();
				});

				// Add the save event handler
				$(guidesPage).find('#manageForm').submit(function(evt) {
				  evt.preventDefault();
				  if (manage) {
				    console.log('Saving...');

  				  var res = {};
  				  if ($(guidesPage).find('#newKey').val().length > 1) {
  				    res._id = $(guidesPage).find('#newKey').val();
  				  }
  					res.title = $(guidesPage).find('#newTitle').val();
  					res.description = $(guidesPage).find('#newDescription').val();
  					res.note = $(guidesPage).find('#newNote').val();
  					if ($(guidesPage).find('#newRev').val().length > 1) {
  					  res._rev = $(guidesPage).find('#newRev').val();
  					}
  					res.parameter = $(guidesPage).find('#newParam').val();

            console.log(JSON.stringify(res));

            if (online) {
  				    $.post(url,JSON.stringify(res),function(data,status) {
  				      $(guidesPage).find('#newResults').text('Success!');

    				    setTimeout(function(){
                  $(guidesPage).find('#newFeedback').hide();
                  $(guidesPage).find('#newResults').text('');
    				    },2000);

  				    }).fail(function(jqXHR, textStatus, errorThrown) {
  				      $(guidesPage).find('#newResults').removeClass('newResults');
  			        $(guidesPage).find('#newResults').addClass('newResultsError');
  			        $(guidesPage).find('#newResults').text('Error! ' + errorThrown);

    				    setTimeout(function(){
                  $(guidesPage).find('#newFeedback').hide();
                  $(guidesPage).find('#newResults').text('');
    				    },2000);

				    });

				    } else {
				     console.log('Offline!');
				     pouch.post(res,function(err,response) {
				       console.log(response);
				       if(err) {
				          $(guidesPage).find('#newResults').text('Error! ' + err);
				       } else {
				          $(guidesPage).find('#newResults').text('Saved Locally');
				       }
               setTimeout(function(){
                  $(guidesPage).find('#newFeedback').hide();
                  $(guidesPage).find('#newResults').text('');
    				    },2000);

				     });
				    };

            $(guidesPage).find('#newFeedback').show();
				    $(guidesPage).find('#newResults').text('Saving!');

				  }

				});


				$(guidesPage).find('#aboutEvt').click(function(evt) {
				  console.log('In event');
					evt.preventDefault();
					$(guidesPage).find('#about').slideToggle("slow");
				});

        $(guidesPage).find('#search').on('keydown',(function(evt) {
          if (evt.keyCode == 13) {
            console.log('In search '+ $(this).val());
            evt.preventDefault();

            if (online) {


            var u = searchUrl1+$(this).val()+searchUrl2+$(this).val()+searchUrl3;
            console.log(u);

            $(guidesPage).find('#resultList tbody').remove();
            $(guidesPage).find('#results').removeClass('not');
            $(guidesPage).find('#results').show();

            $.get(u,function(data,status) {
              console.log("Data " + data);
              var d = JSON.parse(data);
  		        var pd = []
  		        for (var i=0; i<d.rows.length;i++){
  		          pd.push(d.rows[i].doc);
  		        }

  			      $(guidesPage).find('#resultList').append($('#resultsRow').tmpl(pd));


              if (manage) {
  					    $(guidesPage).find('.editNav').slideToggle("fast");
              }

              updateEventHandler();

				    }).fail(function(jqXHR, textStatus, errorThrown) {
			        console.log('Error! ' + errorThrown);
				    });

            } else {
              console.log("Search in offline");

              $(guidesPage).find('#resultList tbody').remove();
              $(guidesPage).find('#results').removeClass('not');
              $(guidesPage).find('#results').show();


              pouch.query('my_index', {key: $(this).val().toUpperCase(),include_docs: 'true'}).then(function (result) {
                console.log(result);

                var d = result;
    		        var pd = []
    		        for (var i=0; i<d.rows.length;i++){
    		          pd.push(d.rows[i].doc);
    		        }

    			      $(guidesPage).find('#resultList').append($('#resultsRow').tmpl(pd));


                if (manage) {
    					    $(guidesPage).find('.editNav').slideToggle("fast");
                }

                updateEventHandler();

              });

            }

          }
        }));

				initialised = true;
			}
		}
	}




  function updateEventHandler() {

        $(guidesPage).find('.resultDetail').click(function(evt) {
          var val=$(this).attr('value');
          console.log('Found: ' + val);
          evt.preventDefault();
          $(guidesPage).find('#'+val).slideToggle("slow");
        });

        $(guidesPage).find('.resultEdit').click(function(evt) {
          var val=$(this).attr('value');
				  console.log('In event edit '+val);
					evt.preventDefault();
					// get the values and push them into the edit section

          if ( online ) {

            $.get(url+"/"+val,function(data,status) {
              console.log("Data " + data);
              var res = JSON.parse(data);

    					$(guidesPage).find('#newKey').val(res._id);
    					$(guidesPage).find('#newTitle').val(res.title);
    					$(guidesPage).find('#newDescription').val(res.description);
    					if (res.note) {
    					  $(guidesPage).find('#newNote').val(res.note);
    					}
    					$(guidesPage).find('#newRev').val(res._rev);
    					if (res.parameter) {
    					  $(guidesPage).find('#newParam').val(res.parameter);
    					}


  			    }).fail(function(jqXHR, textStatus, errorThrown) {
  		        console.log('Error! ' + errorThrown);
  			    });

          } else {

            pouch.get(val , function (err,res) {
    					$(guidesPage).find('#newKey').val(res._id);
    					$(guidesPage).find('#newTitle').val(res.title);
    					$(guidesPage).find('#newDescription').val(res.description);
    					if (res.note) {
    					  $(guidesPage).find('#newNote').val(res.note);
    					}
    					$(guidesPage).find('#newRev').val(res._rev);
    					if (res.parameter) {
    					  $(guidesPage).find('#newParam').val(res.parameter);
    					}


            });


          }


				});



  }

	function closeAll(page){
	  console.log('In close all');
    $(page).find('#thumbs').addClass('not');
	}
}();
