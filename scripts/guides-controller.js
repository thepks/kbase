guidesController = function() {
	var guidesPage;
	var initialised = false;
	var manage = false;
	var logged_on = false;
	var url = '/kbase';
	var searchUrl1 = '/kbase/_design/kb/_search/keywords?q=description:';
  var searchUrl2 = '%20OR%20title:';
  var searchUrl3 = '&include_docs=true';
  var self;

	return {
		init : function(page) {
			if (!initialised) {
				guidesPage = page;
				self = this;
        $(guidesPage).find('#logoffEvt').hide();

        console.log('Initialising');
        self.hideAll();

				$(guidesPage).find('#homeEvt').click(function(evt) {
				  console.log('In event');
					evt.preventDefault();
					self.hideAll();
					if (manage) {
					  manage = !manage;
					}
				});

				$(guidesPage).find('#manageEvt').click(function(evt) {
				  console.log('In event manage');
				  $(guidesPage).find('#home').hide();
	        $(guidesPage).find('#about').hide();
          $(guidesPage).find('#authentication').hide();

				  manage = ! manage;
					evt.preventDefault();
					$(guidesPage).find('#manage').slideToggle("slow");
					$(guidesPage).find('.editNav').slideToggle("fast");
					$(guidesPage).find('#manageTable').find('input').val('');
					$(guidesPage).find('#newSubmit').val('Save');

				});


       	$(guidesPage).find('#logonEvt').click(function(evt) {
  				  console.log('In event logon');
	  				evt.preventDefault();
	  				self.hideAll();
		  			$(guidesPage).find('#authentication').slideToggle("slow");

  				});

          $(guidesPage).find("#searchBtnEvt").click(function(evt) {
            evt.preventDefault();
            $(guidesPage).find('#authentication').hide();
            self.search();
          });

        	$(guidesPage).find('#logoffEvt').click(function(evt) {
        	  var promise_logoff;
  				  console.log('In event logoff');
	  				evt.preventDefault();
		  			$(guidesPage).find('#logonEvt').show();
            $(guidesPage).find('#logoffEvt').hide();
            logged_on = false;

  				  promise_logoff = $.ajax({
  				    type: "DELETE",
  				    url: "/_session"
  				  });

  	  			promise_logoff.done(function(data, status, jqXHR){
  	  			    // Mod to add in setting the cookie
                console.log("Data: " + data + "\nStatus: " + status);
            });
            promise_logoff.fail(function(data,status) {
                console.log("Error! "+ data + "\nStatus: " + status);
            });

            self.hideAll();
  				});

  				$(guidesPage).find('#authButton').click(function(evt) {
  				  var promise_logon;
  				  console.log('In logon');
  				  var usr = $(guidesPage).find('#username').val();
  				  var pwd = $(guidesPage).find('#password').val();
  				  var jname = [];
  				  promise_logon = $.ajax({
  				    type: "POST",
  				    url: "/_session",
  				    data: {
    				    name : usr,
    				    password : pwd
  	  			  }
  				  });
  	  			promise_logon.done(function(data, status, jqXHR){
                console.log("Data: " + data + "\nStatus: " + status);
                auth_token = jqXHR.getResponseHeader("AuthSession");
    	       	  $(guidesPage).find('#authentication').hide();
    		  			$(guidesPage).find('#logonEvt').hide();
                $(guidesPage).find('#logoffEvt').show();

                self.hideAll();
                logged_on = true;
            });
            promise_logon.fail(function(data,status) {
                console.log("Error! "+ data + "\nStatus: " + status);

  				      $(guidesPage).find('#auth-results').show();
  			        $(guidesPage).find('#auth-results').text('Logon Failed! ' + status);

    				    setTimeout(function(){
    				      $(guidesPage).find('#auth-results').hide();
    				    },2000);
              });

  				});



				// Add the save event handler
				$(guidesPage).find('#newSubmit').click(function(evt) {
				  var promise_save;
				  evt.preventDefault();
				  if (manage) {
				    console.log('Saving...');
				    // Disable the save button
            $(guidesPage).find('#newSubmit').attr('disabled',true);
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

            promise_save = $.ajax({
      				url: url,
      				type: "POST",
      				data: JSON.stringify(res),
      				contentType: "application/json; charset=utf-8",
      				dataType: "json"
            });
      			promise_save.done(function(data, status) {

      				$(guidesPage).find('#newResults').show();
				      $(guidesPage).find('#newResults').text('Success!');

    					$(guidesPage).find('#manage').find('input').val('');
    					$(guidesPage).find('#newSubmit').val('Save');

  				    setTimeout(function(){
  				      $(guidesPage).find('#newResults').hide();
                $(guidesPage).find('#newResults').text('');
                $(guidesPage).find('#newSubmit').attr('disabled',false);
  				    },2000);
      			});

      			promise_save.fail(function(data,status) {
  				      $(guidesPage).find('#newResults').show();
  			        $(guidesPage).find('#newResults').text('Error! ' + JSON.stringify(data));

    				    setTimeout(function(){
                  $(guidesPage).find('#newResults').hide();
                  $(guidesPage).find('#newResults').text('');
                  $(guidesPage).find('#newSubmit').attr('disabled',false);
    				    },5000);
				    });

				    $(guidesPage).find('#newFeedback').show();
				    $(guidesPage).find('#newResults').text('Saving!');
			    }
				});

				$(guidesPage).find('#aboutEvt').click(function(evt) {
				  console.log('In event');
					evt.preventDefault();
					self.hideAll();
					$(guidesPage).find('#about').slideToggle("show");
				});

        $(guidesPage).find('#search').on('keydown',(function(evt) {
          if (evt.keyCode == 13) {
            evt.preventDefault();
            $(guidesPage).find('#authentication').hide();
            self.search();
          }
        }));

				initialised = true;
			}
		},


  updateEventHandler : function() {

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
					// get the values for title and rev

					$.ajax({
                  url: url+"/"+val,
                  type: "GET",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function(data, status, jqXHR) {

                  console.log("Data " + data);
                  var res = data;

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
                  },
                  error: function(data,status) {
        		        console.log('Error! ' + JSON.stringify(data));
			            }
			         });
        });

        $(guidesPage).find('.resultEdit').click(function(evt) {
          var val=$(this).attr('value');
				  console.log('In event edit '+val);
					evt.preventDefault();
					// get the values and push them into the edit section


         $.ajax({
                  url: url+"/"+val,
                  type: "GET",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function(data, status, jqXHR) {

                    console.log("Data " + data);
                    var res = data;

                    // Delete old values
          					$(guidesPage).find('#manage').find('input').val('');
          					$(guidesPage).find('#newSubmit').val('Save');


                    // Push new
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
                  },
                  error: function(data, status, jqXHR) {
        		        console.log('Error! ' + JSON.stringify(data));
			            }
			            });

        });
    },

	closeAll : function (page) {
	  console.log('In close all');
    $(page).find('#thumbs').addClass('not');
	},
  hideAll : function() {
	   $(guidesPage).find('#home').hide();
	   $(guidesPage).find('#about').hide();
	   $(guidesPage).find('#manage').hide();
	   $(guidesPage).find('#results').hide();
	   $(guidesPage).find('#authentication').hide();
	 },


	 search : function () {

	    var val = $(guidesPage).find('#search').val();
	    var u = searchUrl1+val+searchUrl2+val+searchUrl3;
      console.log(u);

      $(guidesPage).find('#resultsBody').children().remove();
      $(guidesPage).find('#results').removeClass('not');
      $(guidesPage).find('#results').show();

        $.ajax({
                  url: u,
                  type: "GET",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function(data, status, jqXHR) {

                    console.log("Data " + data);
                    var d = data;
                    var pd = [];
                    for (var i=0; i<d.rows.length;i++){
                      pd.push(d.rows[i].doc);
                    }

                    $(guidesPage).find('#resultsBody').append($('#resultsRow').tmpl(pd));


                    if (manage) {
              		    $(guidesPage).find('.editNav').slideToggle("fast");
                    }

                    self.updateEventHandler();
                  },
                  error: function(data,status) {
                    console.log('Error! ' + data);
                  }
                });

	 }
  };

}();
