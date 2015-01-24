guidesController = function() {
	var guidesPage;
	var initialised = false;
	var manage = false;

	return {
		init : function(page) {
			if (!initialised) {
				guidesPage = page;

        console.log('Initialising');
				$(guidesPage).find('#homeEvt').click(function(evt) {
				  console.log('In event');
					evt.preventDefault();
<!--					$(guidesPage).find('#home').slideToggle("slow");  ->
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

				$(guidesPage).find('#aboutEvt').click(function(evt) {
				  console.log('In event');
					evt.preventDefault();
					$(guidesPage).find('#about').slideToggle("slow");
				});

        $(guidesPage).find('#search').on('keydown',(function(evt) {
          if (evt.keyCode == 13) {
            console.log('In search '+ $(this).val());
            evt.preventDefault();

            $(guidesPage).find('#resultList tbody').remove();
            $(guidesPage).find('#results').removeClass('not');
            $(guidesPage).find('#results').show();
            // Dummy add
            var res = [{ title: 'Max Runtime', note : 0121132, key:'010219jqdqdha8wwjqjq', description: 'some words' },
            { title: 'Max Runtime2', note : 712132, key:'0102wfwedqdha8wwjqjq',description: 'some words2' },
            { title: 'Max Runtime4', note : 121132, key:'010219jqij4owwwwjqjq',description: 'some words3' }];

//            $(guidesPage).find('#resultList').remove('.resultsBody');
//            $(guidesPage).find('#resultList').remove('.detail');
            $(guidesPage).find('#resultList').append($('#resultsRow').tmpl(res));
            //html($('#resultsRow').tmpl(res));

            if (manage) {
//              $(guidesPage).find('#manage').slideToggle("slow");
					    $(guidesPage).find('.editNav').slideToggle("fast");

            }

            updateEventHandler();

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


var sample = '{ \
    "_id": "4b2ff3fd1a3a7224cea84f8719670647", \
    "_rev": "3-80d2fe988e30914a31f45d295029fba5", \
    "title": "Context Switches", \
    "description": "For context switches a value would be typically 1500 x CPU.  At 5000 x CPU this become limiting", \
    "note": "" \
}';
					var res = JSON.parse(sample);

					$(guidesPage).find('#newKey').val(res._id);
					$(guidesPage).find('#newTitle').val(res.title);
					$(guidesPage).find('#newDescription').val(res.description);
					$(guidesPage).find('#newNote').val(res.note);
					$(guidesPage).find('#newRev').val(res._rev);

				});



  }

	function closeAll(page){
	  console.log('In close all');
    $(page).find('#thumbs').addClass('not');
	}
}();
