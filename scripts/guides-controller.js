guidesController = function() {
	var guidesPage;
	var initialised = false;
	var manage = false;
	var url = '/kbase';
	var searchUrl1 = '/kbase/_design/kb/_search/keywords?q=description:';
  var searchUrl2 = '%20OR%20title:';
  var searchUrl3 = '&include_docs=true';

	return {
		init : function(page) {
			if (!initialised) {
				guidesPage = page;

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
          }
        }));

				initialised = true;

			}


  function updateEventHandler() {

        $(guidesPage).find('.resultDetail').click(function(evt) {
          var val=$(this).attr('value');
          console.log('Found: ' + val);
          evt.preventDefault();
          $(guidesPage).find('#'+val).slideToggle("slow");
        });


        $(guidesPage).find('.resultDelete').click(function(evt) {
          var val=$(this).attr('value');
				  console.log('In event delete '+val);
					evt.preventDefault();
					// get the values and push them into the edit section

          $.get(url+"/"+val,function(data,status) {
            console.log("Data " + data);
            var res = JSON.parse(data);

            var conf = window.confirm('Do you want to delete ' + res.title);

            if (conf) {
              var dest1 = url+"/"+res._id+"?rev="+res._rev;
              $.ajax({ url: dest1, type: 'DELETE', success: function(data,status) {
        					$(guidesPage).find('#home').parent().siblings().children('div').hide();
        					if (manage) {
        					  manage = !manage;
      					  }
                }
              });
            }
			    }).fail(function(jqXHR, textStatus, errorThrown) {
		        console.log('Error! ' + errorThrown);
			    });
        });

        $(guidesPage).find('.resultEdit').click(function(evt) {
          var val=$(this).attr('value');
				  console.log('In event edit '+val);
					evt.preventDefault();
					// get the values and push them into the edit section


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

        });
  }

	function closeAll(page) {
	  console.log('In close all');
    $(page).find('#thumbs').addClass('not');
	}

}}}();
