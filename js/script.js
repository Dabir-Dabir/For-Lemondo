// Variables
const sm_width = 576,
	md_width = 768,
	lg_width = 992,
	xl_width = 1400;
var next_article = $('.first-article').eq(0).data('next-article');
var more_articles = true;
var right_column_height = $('.advertising.vert').eq(0).height() + 20;
var links_in_text = {};
var links_in_text_mobile  = {};

var windowWidth = $(window).width();
// /Variables

// Select dropdown plugin
function createCustomSelect() {
  $('select').each(function(i, select) {
    if (!$(this).next().hasClass('select-dropdown')) {
      $(this).after('<div class="select-dropdown ' + ($(this).attr('class') || '') + '" tabindex="0"><span class="current"></span><div class="list"><ul></ul></div></div>');
      var dropdown = $(this).next();
      var options = $(select).find('option');
      var selected = $(this).find('option:selected');
      dropdown.find('.current').html(selected.data('display-text') || selected.text());
      options.each(function(j, o) {
        var display = $(o).data('display-text') || '';
        dropdown.find('ul').append('<li class="option ' + ($(o).is(':selected') ? 'selected' : '') + '" data-value="' + $(o).val() + '" data-display-text="' + display + '">' + $(o).text() + '</li>');
      });
    }
  });
}
// /Select dropdown plugin

// Rating plugin
(function( $ ) {
	$.fn.addRating = function(options) {
		var obj = this;
		var settings = $.extend({
			max : 5,
			half : true,
			fieldName : 'rating',
			fieldId : 'rating',
			fieldClass: 'rating',
			icon : 'star'

		}, options );
		this.settings = settings;
		$(this).data('settings',settings)

		// create the stars
		for(var i = 1 ; i <= settings.max ; i++)
		{
			var star = $('<i/>').addClass('material-icons').html(this.settings.icon+'_border').data('rating', i).appendTo(this).click(
				function(){
					obj.setRating($(this).data('rating'));
				}
			).hover(
				function(e){
					obj.showRating($(this).data('rating'), false);
				}, function(){
					obj.showRating(0,false);
				}
			);
		}
		$(this).append('<input type="hidden" name="'+settings.fieldName+'" id="'+settings.fieldId+'" class="'+settings.fieldClass+'"/>');
		return this
	};

	$.fn.setRating = function(numRating) {
		var obj = this;
		$('#'+obj.settings.fieldId).val(numRating);
		obj.showRating(numRating, true);
	};

	$.fn.showRating = function(numRating, force) {
		var obj = this;
		if($('#'+obj.settings.fieldId).val() == '' || force)
		{
			$(obj).find('i').each(function(){
				var icon = obj.settings.icon+'_border';
				if($(this).data('rating') <= numRating)
				{
					icon = obj.settings.icon;
				}
				$(this).html(icon);
			})
		}
	}

}( jQuery ));
// /Rating plugin

// Distance Slider Plugin
$(document).ready(function(){

	$('#price-range-submit').hide();

	$("#min_price,#max_price").on('change', function () {

		var min_price_range = parseInt($("#min_price").val());

		var max_price_range = parseInt($("#max_price").val());

		if (min_price_range > max_price_range) {
			$('#max_price').val(min_price_range);
		}

		$("#slider-range").slider({
			values: [min_price_range, max_price_range]
		});

	});


	$("#min_price,#max_price").on("paste keyup", function () {

		var min_price_range = parseInt($("#min_price").val());

		var max_price_range = parseInt($("#max_price").val());

		if(min_price_range == max_price_range){

			max_price_range = min_price_range + 100;

			$("#min_price").val(min_price_range);
			$("#max_price").val(max_price_range);
		}

		$("#slider-range").slider({
			values: [min_price_range, max_price_range]
		});

	});


	// $(function () {
	// 	$("#slider-range").slider({
	// 		range: true,
	// 		orientation: "horizontal",
	// 		min: 0,
	// 		max: 10000,
	// 		values: [0, 10000],
	// 		step: 100,
	//
	// 		slide: function (event, ui) {
	// 			if (ui.values[0] == ui.values[1]) {
	// 				return false;
	// 			}
	//
	// 			$("#min_price").val(ui.values[0]);
	// 			$("#max_price").val(ui.values[1]);
	// 		}
	// 	});
	//
	// 	$("#min_price").val($("#slider-range").slider("values", 0));
	// 	$("#max_price").val($("#slider-range").slider("values", 1));
	//
	// });
	//
	// $("#slider-range,#price-range-submit").click(function () {
	//
	// 	var min_price = $('#min_price').val();
	// 	var max_price = $('#max_price').val();
	//
	// 	$("#searchResults").text("Here List of products will be shown which are cost between " + min_price  +" "+ "and" + " "+ max_price + ".");
	// });

});
// /Distance Slider Plugin

// Event listeners

// Open/close
$(document).on('click', '.select-dropdown', function(event) {
  $('.select-dropdown').not($(this)).removeClass('open');
  $(this).toggleClass('open');
  if ($(this).hasClass('open')) {
    $(this).find('.option').attr('tabindex', 0);
    $(this).find('.selected').focus();
  } else {
    $(this).find('.option').removeAttr('tabindex');
    $(this).focus();
  }
});
// Close when clicking outside
$(document).on('click', function(event) {
  if ($(event.target).closest('.select-dropdown').length === 0) {
    $('.select-dropdown').removeClass('open');
    $('.select-dropdown .option').removeAttr('tabindex');
  }
  event.stopPropagation();
});
// Option click
$(document).on('click', '.select-dropdown .option', function(event) {
  $(this).closest('.list').find('.selected').removeClass('selected');
  $(this).addClass('selected');
  var text = $(this).data('display-text') || $(this).text();
  $(this).closest('.select-dropdown').find('.current').text(text);
  $(this).closest('.select-dropdown').prev('select').val($(this).data('value')).trigger('change');
});

// Keyboard events
$(document).on('keydown', '.select-dropdown', function(event) {
  var focused_option = $($(this).find('.list .option:focus')[0] || $(this).find('.list .option.selected')[0]);
  // Space or Enter
  if (event.keyCode == 32 || event.keyCode == 13) {
    if ($(this).hasClass('open')) {
      focused_option.trigger('click');
    } else {
      $(this).trigger('click');
    }
    return false;
    // Down
  } else if (event.keyCode == 40) {
    if (!$(this).hasClass('open')) {
      $(this).trigger('click');
    } else {
      focused_option.next().focus();
    }
    return false;
    // Up
  } else if (event.keyCode == 38) {
    if (!$(this).hasClass('open')) {
      $(this).trigger('click');
    } else {
      var focused_option = $($(this).find('.list .option:focus')[0] || $(this).find('.list .option.selected')[0]);
      focused_option.prev().focus();
    }
    return false;
  // Esc
  } else if (event.keyCode == 27) {
    if ($(this).hasClass('open')) {
      $(this).trigger('click');
    }
    return false;
  }
});
// plugin end

function loadArticle(next) {
	if (next) {
		var jqxhr = $.getJSON(next, function(data) {
			next_article = data.nextArticle;
			var article = [];
			article.push('<div class="container"><div class="row"><div class="col-md-9"><div class="row">');

			article.push( '<h1 class="article-title col">' + data.articleTitle + '</h1>');
			article.push( '<button class="bookmark-article-' + data.articleId + ' bookmark material-icons bookmark-icon col-auto">bookmark</button> </div>');
			if (data.articleSubtitle) {
				article.push( '<h2 class="subtitle">' + data.articleSubtitle + '</h2>');
			}

				article.push('<div class="technical-info">');
				article.push('<span class="publish-date">' + data.articlePublishDate + '</span>');
				article.push('<span class="publish-time">' + data.articlePublishTime + '</span>');
				article.push('<span class="article-views"><i class="material-icons">remove_red_eye</i> <span class="number">' + data.articleViews + '</span></span></div>');

				article.push('<div class="hashtags"><ul>');
				$.each(data.articleHashtags, function(index, element) {
			        article.push('<li><a href="' + element.url + '">' + element.hashtag + '</a>');
			    });

				article.push('</ul></div><div class="breadcrumbs"><ol>');
				$.each(data.articleBreadcrumbs, function(index, element) {
			        article.push('<li><a href="' + element.url + '">' + element.breadcrumb + '</a>');
			    });
			    article.push('</ol></div>');
			    article.push('<section class="article-content">' + data.articleContentFirst + '</section>');
			    article.push(data.sameArticles);
			    article.push('<div class="mobile-adversting col-12 d-md-none">' + data.mobileAdversting + '</div>');
			    article.push('<section class="article-content">' + data.articleContentLast + '</section>');

			    article.push('</div>');

			    article.push('<div class="col-md-3">');
			    article.push('<div class="adversting d-none d-md-block">' + data.adversting + '</div>');
			    article.push('</div>');

			article.push('</div></div>');
			

			var classes = "single-article" + data.articleId;

			$( "<article/>", {
			    "class": "single-article article-" + data.articleId,
			    html: article.join( "" )
			}).appendTo( ".articles" );

		})
			.fail(function(){

				next_article = '';
				more_articles = false;

				$( "<div/>", {
				    "class": "col-md-12",
				    html: "<div class='container'><div class='row'><h4 class='col-12' style='text-align:center'>К сожалению не удалось загрузить статью.</h4></div></div>"
				}).appendTo( ".articles" );				
			});

	} else {
		more_articles = false;
		$( "<div/>", {
		    "class": "col-md-12",
		    html: "<div class='container'><div class='row'><h4 class='col-12' style='text-align:center'>Больше статей нет.</h4></div></div>"
		}).appendTo( ".articles" );
	}
}

function loadOnScroll() {
	var top = ($(window).scrollTop() || $("body").scrollTop());
	var current_scroll = top + $(window).height();
	var articles_offset_top = $("body.blog-post .articles").eq(0).offset().top + $("body.blog-post .articles").height() - 200;
	if (current_scroll >= articles_offset_top && more_articles) {
		loadArticle(next_article);
	}
}

function miniBoxes() {

	if ($(window).width() >= lg_width) {
		function miniBoxesDesktop() {
			$('.article-content a[href*="triit.ru"]').each(function(index, el) {
				var offset = $(this).parent().offset().top - $(this).parent().parent().parent().offset().top;
				var current_data = $(this).data("self-link-in-text");
				links_in_text[current_data] = offset;
			});

			$('.link-minibox').each(function(index, el) {
				var current_data = $(this).data("self-link-minibox");
				var offset_top = links_in_text[current_data];
				if(offset_top < right_column_height) {
					offset_top = right_column_height;
				}
				$(this).css({"top": offset_top, "opacity": "1"});

				right_column_height = offset_top + $(this).height() + 10;
			});
		}
		setTimeout(miniBoxesDesktop, 2000);
	} else {

		var same_index = 0;
		var additional_index = 0;
		var same_p = '';

		$('.article-content a[href*="triit.ru"]').each(function(index, el) {
			var parent_article = $(this).parent().parent().parent().parent().parent().parent().attr("id");
			var parent_article_content = $(this).parent().parent().index();
			var parent_p = $(this).parent().index();
			if (same_index == parent_article_content || same_index == 0) {
				if (same_p == parent_p || same_p == '') {
					same_p = parent_p;

				} else {
					additional_index += 1;
					parent_p = parent_p + additional_index;
				}
			} else {
				additional_index = 0;
				same_p = '';
			}

			same_index = parent_article_content;

			var current_data = $(this).data("self-link-in-text");
			var current_href = $(this).attr("href");
			links_in_text_mobile[current_data] = [parent_article, parent_article_content, parent_p, current_href];
		});

		$('.link-minibox').each(function(index, el) {
			var current_data = $(this).data("self-link-minibox");
			var current_class = $(this).data("class");

			var element_id = "#" + links_in_text_mobile[current_data][0];
			var element_id_pure = links_in_text_mobile[current_data][0];
			var content_index = links_in_text_mobile[current_data][1];
			var p_index = links_in_text_mobile[current_data][2];
			var element_href = links_in_text_mobile[current_data][3];

			var current_el = '<a href="' + element_href + '" class="' + current_class + '">' + $(this).html() + '</a>';

			var next_element = $(element_id).find('.col-md-9').children().eq(content_index).children().eq(p_index + 1);
			var carousel_id = element_id_pure + "-" + content_index + "-" + p_index;
			var carousel_id_hashtag = "#" + carousel_id;
			if (next_element.attr("id") != carousel_id) {
				var carousel = '<div id="' + carousel_id + '" class="mobile-minibox-carousel"></div>';
				var after_to = $(element_id).find('.col-md-9').children().eq(content_index).children().eq(p_index);
				(after_to).after(carousel);

				$(carousel_id_hashtag).append(current_el);

				$(carousel_id_hashtag).slick({
				  dots: false,
				  infinite: false,
				  slidesToShow: 1,
				  centerPadding: '30px',
				  arrows: false,
				  centerMode: true,
				  focusOnSelect: true,
				  initialSlide: 0,
				  slidesToScroll: 1
				});
			} else {
				$(carousel_id_hashtag).slick('slickAdd', current_el);
			}

		});
	}
}

function validation (form) {
	let is_complited = true;

	if ( !$("#" + form).hasClass('disable-inputs') ) {
		$('#' + form + ' .set-time-input').each(function(index) {
			this_val = $('#' + form).find('.set-time-input').eq(index).val();
			if( /[А-Я]/.test(this_val) || this_val == '' || this_val == undefined || this_val == 0) {
				is_complited = false;
				return false;
			} else {
				is_complited = true;
			}
		});
	}

	if (is_complited && $('#set-rating').val() > 0) {
		$('#' + form + ' button[type=submit]').removeAttr('disabled');
	} else {
		$('#' + form + ' button[type=submit]').attr('disabled', 'disabled');
	}
}

function setSumTime (form) {
	if ( $("#" + form).hasClass('disable-inputs') ) return false;

    function timestrToSec(timestr) {
		var parts = timestr.split(":");
		return (+parts[0] * 3600) +
	        (+parts[1] * 60) +
	        (+parts[2]);
	}
	function pad(num) {
		if(num < 10) {
		    return "0" + num;
		} else {
		    return "" + num;
		}
	}
	function formatTime(seconds) {
		return [pad(Math.floor(seconds/3600)),
	        pad(Math.floor(seconds/60)%60),
	        pad(seconds%60),
	    ].join(" : ");
	}

	let current_time = "00 : 00 : 00";
	let this_form = form.toString();

    let sub_times_sum = 0;
    $('#' + this_form + ' .set-time-input').each(function(index, el) {
    	let this_val = $(this).val()
    	if ( this_val.length == 12 && Number.isInteger(timestrToSec(this_val)) ) {
    		sub_times_sum += timestrToSec(this_val);
    	} else if (this_val.length == 7 && Number.isInteger(timestrToSec(this_val + " : 00")) ) {
    		sub_times_sum += timestrToSec(this_val + " : 00");
    	}
    });

    current_time = formatTime(sub_times_sum);
    if(current_time == "NaN : NaN : NaN" || current_time == "00 : 00 : 00") current_time = "—— : —— : ——";

    $('#' + form).find('.set-time-output').val(current_time);
}

function eventIsFinished() {
	$(document).on('click', '.is-finished', function(event) {
		let current = $(this).closest('.is-finished').find('.current').text();
		let form = $(this).closest('form');
		if ( current == "Финишировал" ) {
			if ( form.hasClass('disable-inputs') ) form.removeClass('disable-inputs');
		} else {
			if ( !form.hasClass('disable-inputs') ) form.addClass('disable-inputs');
		}
	});
}

function setEventResultModal () {
	eventIsFinished();

	$.mask.definitions['m'] = "[0-6]";
	
	$('.submit-event-modal .set-time-input:not(.h-and-m)').mask("99 : m9 : m9", {placeholder:"ЧЧ : ММ : СС", completed: 
		function(){
			let parent_form_id = $(this).closest('form').attr("id");
			validation(parent_form_id);
			let value = $(this).val();
			setSumTime(parent_form_id);

		}
	});
	$('.submit-event-modal.tri .set-time-input.h-and-m').mask("99 : m9", {placeholder:"ЧЧ : ММ", completed: 
		function(){
			let parent_form_id = $(this).closest('form').attr("id");
			validation(parent_form_id);
			setSumTime(parent_form_id);
		}
	});
	$('.submit-event-modal.tri .set-time-input').keyup(function(e){
		if(e.keyCode == 8) {
			let parent_form_id = $(this).closest('form').attr("id");
			validation(parent_form_id);
			setSumTime(parent_form_id);			
		}
	});

	$('.set-rating').addRating({
		fieldId: "set-rating"
	});

	$('.set-rating i').click(function() {
		let form_id = $(this).closest('form').attr("id");
		validation(form_id);
		setSumTime(form_id);
	});
}

function profileReviewsMore() {

	if (windowWidth <= sm_width) {
		$('body.profile .review').each(function() {
			let p = $(this).find('p:eq(0)');

			console.log(p.height() + 'p');

			if ( p.height() > 64 ) {
				p.find('button.read-full').removeClass('d-none');
				p.height(64);
			} else {
				p.find('button.read-full').addClass('d-none');
			}
		});
	}
}

jQuery(document).ready(function($) {

	// Components
	$(document).on('click', '.read-full', function(event) {
		$(this).parent().addClass('full-height');
	});

	$(document).on('click', '.read-less', function(event) {
		$(this).parent().removeClass('full-height');
	});

	$(document).on('click','.bookmark',function(index) {
		$(this).toggleClass('bookmarked');
	});

	$(document).on('click','.like',function(index) {
		$(this).toggleClass('liked');
	});


  	$(document).on('click', 'body.profile li[data-for="#reviews-tab"]', function(event) {
  		profileReviewsMore();
  	});
	// /Components


	// Always Min FullHeight
	$('main').css('min-height', $(window).height() - $('footer').height() - 100);

	// Datapicer
	// Current date
	var now = new Date();	 
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = (day)+ "." + (month) + "." + now.getFullYear();

	$( ".current-date" ).val(today);
	// /Current date

	if ( $('body').hasClass('admin-protocols') || $('body').hasClass('search-events') ) {

		$( ".input-daterange" ).datepicker({
		    language: "ru",
		    autoclose: true,
		    format: "dd.mm.yyyy",
		    todayHighlight: true,
		    templates: {leftArrow:"<i class='material-icons'>chevron_left</i>",rightArrow:"<i class='material-icons'>chevron_right</i>"},
	    	orientation: "bottom"
		});
	}
	// /Datapicer

	// Main Search
	// dropdown search init
	$('#search-input').keyup(function() {
		var is_tiping = $("#search-input").val();
		if (is_tiping === "") {
		    $('.dropdown-search').hide();
		} else {
			$('.dropdown-search').show();
		}
	});
	$(document).mouseup(function (e){ 
		var div = $(".dropdown-search"); 
		if (!div.is(e.target) 
		    && div.has(e.target).length === 0) { 
			div.hide(); 
		}
	});
	// /dropdown search init

	// searching on mobiles
	$('#mobile-search-button').click(function() {
		$('#search__form').addClass('search__form--searching');
	});

	$('#search__close').click(function() {
		$('#search__form').removeClass('search__form--searching');
	});
	// /searching on mobiles
	// /Main Search

	// Open filter
  	$(document).on('click', 'button.open-filter', function(event) {
  		$('.search-events-filter').addClass('open');
  		$('.shadow-overlay').addClass('blur');
  	});

  	$(document).on('click', '.search-events-filter button.submit, .search-events-filter button.cancel', function(event) {
  		$('.search-events-filter').removeClass('open');
  		$('.shadow-overlay').removeClass('blur');
  	});
  	// /Open filter

  	// Modal-popups
  	$(document).on('click', 'button.cancel', function(event) {
  		$('.modal-popup').removeClass('show-modal-popup');
  	});

  	$(document).on('click', 'button.participation', function(event) {
  		$('.shadow-overlay').addClass('blur');

  		if ($(this).hasClass('register')) {
  			$('.checkin-modal.future-distance').addClass('show-modal-popup');
  		} else {
  			$('.checkin-modal.cancel-distance').addClass('show-modal-popup');
  		}
  	});

  	$(document).on('click', 'button.participation', function(event) {
  		$('.shadow-overlay').addClass('blur');

  		if ($(this).hasClass('register')) {
  			$('.checkin-modal.future-distance').addClass('show-modal-popup');
  		} else {
  			$('.checkin-modal.cancel-distance').addClass('show-modal-popup');
  		}
  	});

  	$(document).on('click', 'button.submit-event', function(event) {
  		$(this).parent().parent().next('.modal-popup').addClass('show-modal-popup');  		
  		$('.shadow-overlay').addClass('blur');
  	});

  	$(document).on('click', 'submit-event-modal button.submit', function(event) {
  		$('.modal-popup').removeClass('show-modal-popup');  		
  		$('.shadow-overlay').removeClass('blur');
  	});

  	$(document).on('click', '.checkin-modal.future-distance button.submit', function(event) {
		$('.checkin-modal.future-distance').removeClass('show-modal-popup');
		$('.checkin-modal.done').addClass('show-modal-popup');
  		$('button.participation').removeClass('register');
  	});

  	$(document).on('click', '.checkin-modal.cancel-distance button.submit', function(event) {
		$('.checkin-modal.cancel-distance').removeClass('show-modal-popup');
		$('button.participation').addClass('register');
		$('.shadow-overlay').removeClass('blur');
  	});

  	$(document).on('click', 'button.cancel, button.close-modal', function(event) {
  		$('.modal-popup').removeClass('show-modal-popup');
  		$('.shadow-overlay').removeClass('blur');
  	});

  	$(document).on('click', '#need-correction', function(event) {
  		$('.correction-modal').addClass('show-modal-popup');
  		$('.shadow-overlay').addClass('blur');
  	});

  	$(document).on('click', '#add-event', function(event) {
  		$('.event-add-modal').addClass('show-modal-popup');
  		$('.shadow-overlay').addClass('blur');
  	});

  	$(document).on('click', '.event-add-modal button.submit', function(event) {
  		$('.event-add-modal').removeClass('show-modal-popup');
  		$('.shadow-overlay').removeClass('blur');
  	});

  	$(document).on('click', '.correction-modal button.submit', function(event) {
  		$('.modal-popup').removeClass('show-modal-popup');
  		$('.shadow-overlay').removeClass('blur');
  	});

  	$('.results-table__body').on('click', '.results-table__row, .results-table__row *', function(event) {
  		$(this).closest('.results-table__row').next().addClass('show-modal-popup');
  		$('.shadow-overlay').addClass('blur');
  	});


  	$(document).on('click', 'button.search-event-popup', function(event) {
  		$('.search-event-modal').addClass('show-modal-popup');
  		$('.shadow-overlay').addClass('blur');
  	});

  	$(document).on('click', '.radio-wrap, .radio-wrap *', function(event) {
  		$('.choose-distance').addClass('show-modal-popup');
  	});

  	$(document).on('click', '.choose-distance button.submit', function(event) {
  		$('.choose-distance').removeClass('show-modal-popup');
  	});

	// Event menu
	$('.tabs-menu-item').each(function(index, el) {
		var selectTab = $(this).data("for");
		if (!$.trim( $(selectTab).html() ).length) {
			$(this).addClass('disabled');
		}
	});
	$('.tabs-menu-item:not(.disabled):first').addClass('active');
	$('.tab-content').each(function(index, el) {
		if ($.trim( $(this).html() ).length) {
			$(this).addClass('active');
			return false;
		}
	});
	$('.tabs-menu-item:not(.disabled)').on('click', function(event) {
		$('.tabs-menu-item').removeClass('active');
		$(this).addClass('active');
		$('.tab-content').removeClass('active');
		var selectTab = $(this).data("for");
		$(selectTab).addClass('active');
	});

	// Ratings modal
	$(document).on('click', '.ratings-count', function(event) {
	  $('.modal-popup-rating').toggleClass('visible');
	});
	// Close when clicking outside
	$(document).on('click', function(event) {
	  if ($(event.target).closest('.modal-popup').length === 0 && $(event.target).closest('.ratings-count').length === 0) {
	    $('.modal-popup-rating').removeClass('visible');
	  }
	  event.stopPropagation();
	});
	// /Rarings modal

	// Actioins modal
	$(document).on('click', '.show-actions', function(event) {
		$(this).next().toggleClass('show-actions-popup');
	});
	// Close when clicking outside
	$(document).on('click', function(event) {
	  if ($(event.target).closest('.show-actions-popup').length === 0 && $(event.target).closest('.show-actions').length === 0) {
	    $('.actions-popup').removeClass('show-actions-popup');
	  }
	  event.stopPropagation();
	});
	// /Actions modal

	// /Modal-popups

	// Chat
	$('#open-chat').click(function() {
		$('#chat').addClass('open');
	});

	$('body').on('click', '*:not( #chat, #chat *), #chat .top, #chat .top *', function() {
	    $('#chat').removeClass('open');
	});
	// /Chat

	// Right Sidebar
	$('.show---login-sidebar').click(function() {
		$('#shadow-overlay').addClass('blur');
		$('#login-side-menu').addClass('show');
		$('#registration-side-menu').removeClass('show');
	});

	$('.show-registration').click(function() {
		$('#shadow-overlay').addClass('blur');
		$('#registration-side-menu').addClass('show');
		$('#login-side-menu').removeClass('show');
	});

	$('.show---user-menu').click(function() {
		$('#shadow-overlay').addClass('blur');
		$('#user-side-menu').addClass('show');
	});
	// /Right Sidebar

	// Shadow overlay
	$('#shadow-overlay').click(function() {
		if ($('.right-side-menu').hasClass('show')) {
			$('#shadow-overlay').removeClass('blur');
			$('.right-side-menu').removeClass('show');
		}

		if ($('.modal-popup').hasClass('show-modal-popup')) {
			$('.modal-popup').removeClass('show-modal-popup');			
			$('#shadow-overlay').removeClass('blur');
		}
	});
	// /Shadow overlay

	$('.hide-right-side-menu').click(function () {
		$('#shadow-overlay').removeClass('blur');
		$('.right-side-menu').removeClass('show');
	})

	// Slick Carousel
	$('.short-about-us-carousel').slick({
		dots: true,
		infinite: true,
		slidesToShow: 3,
		variableWidth: false,
		adaptiveHeight: true,
		arrows: false,
		centerMode: false,
		focusOnSelect: false,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
			    breakpoint: xl_width,
			    settings: {
			    	dots: true,
					slidesToShow: 2
			    }
			},
			{
			    breakpoint: lg_width,
			    settings: {
			      	dots: false,
			        centerMode: true,
			        centerPadding: '25px',
			        slidesToShow: 2
			    }
			},
			{
			    breakpoint: sm_width,
			    settings: {
			    	dots: false,
			        centerMode: true,
			    	centerPadding: '30px',
					slidesToShow: 1
			    }
			}]
	});

	// sport slider init
	$('#sport-categories-slider').slick({
		slidesToShow: 3,
	  	slidesToScroll: 1,
	  	responsive: [
		  	{
		  		breakpoint: lg_width,
		  		settings: {
		  			slidesToShow: 2,
		  			arrows: false,
		  			centerMode: true,
		  			centerPadding: '25px'
		  		}
		  	},
		  	{
		  		breakpoint: md_width,
		  		settings: {
		  			slidesToShow: 1,
		  			arrows: false,
		  			centerMode: true,
		  			centerPadding: '25px'
		  		}
		  	}
	  	]
	});

	$('.results-carousel').slick({
		slidesToShow: 3,
	  	slidesToScroll: 1,
	  	responsive: [
		  	{
		  		breakpoint: xl_width,
		  		settings: {
		  			slidesToShow: 2,
		  			arrows: false,
		  			centerMode: true,
		  			centerPadding: '25px'
		  		}
		  	},
		  	{
		  		breakpoint: md_width,
		  		settings: {
		  			slidesToShow: 1,
		  			arrows: false,
		  			centerMode: true,
		  			centerPadding: '25px'
		  		}
		  	}
	  	]
	});

	$('.same-competitions-carousel').slick({
		dots: false,
		infinite: false,
		slidesToShow: 3,
		arrows: false,
		centerPadding: 0,
		centerMode: true,
		focusOnSelect: true,
		initialSlide: 0,
		slidesToScroll: 1,
		responsive: [{
			breakpoint: lg_width,
			settings: {
				centerPadding: '30px',
				initialSlide: 1,
				infinite: true,
				slidesToShow: 1,
				centerMode: true
			}
		}]
	});

	$('.popular-events-carousel').slick({
		dots: false,
		infinite: false,
		slidesToShow: 4,
		arrows: false,
		centerPadding: 0,
		centerMode: true,
		focusOnSelect: true,
		initialSlide: 0,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: xl_width,
				settings: {
					centerPadding: '30px',
					initialSlide: 1,
					infinite: true,
					slidesToShow: 3,
					centerMode: true
				}
			},
			{
				breakpoint: lg_width,
				settings: {
					centerPadding: '30px',
					initialSlide: 1,
					infinite: true,
					slidesToShow: 2,
					centerMode: true
				}
			},
			{
				breakpoint: md_width,
				settings: {
					centerPadding: '30px',
					initialSlide: 1,
					infinite: true,
					slidesToShow: 1,
					centerMode: true
				}
			}
		]
	});

	$('.all-years-carousel').slick({
		dots: true,
		infinite: false,
		slidesToShow: 1,
		variableWidth: true,
		arrows: false,
		centerMode: false,
		focusOnSelect: true,
		initialSlide: 0,
	});
	// /Slick Carousel

	// By Pages
	if ($('body').hasClass('blog-post')) {
		$('.same-articles-carousel').slick({
		  dots: false,
		  infinite: false,
		  speed: 300,
		  slidesToShow: 3,
		  arrows: false,
		  centerPadding: 0,
		  centerMode: true,
		  focusOnSelect: true,
		  initialSlide: 0,
		  slidesToScroll: 1,
		  responsive: [{
			      breakpoint: lg_width,
			      settings: {
			        centerPadding: '30px',
			        initialSlide: 1,
			        infinite: true,
					slidesToShow: 1,
			        centerMode: true
			      }
		    }]
		});

		loadOnScroll();

		$(window).scroll(function(){
			loadOnScroll();
		});

		miniBoxes();
	}

	if ($('body').hasClass('profile')) {
		setEventResultModal();
	}

	// /By Pages

	$('.graphic-column').each(function(index, el) {
		var column_height = $(this).data('column-height') + '%';
		$(this).css('height', column_height);
	});

	createCustomSelect();

});

$( document ).ajaxComplete(function( event, request, settings ) {

	// Slick Carousel
	$('.short-about-us-carousel').not('.slick-initialized').slick({
		dots: true,
		infinite: true,
		slidesToShow: 1,
		variableWidth: true,
		arrows: false,
		centerMode: false,
		focusOnSelect: true,
		initialSlide: 0,
		slidesToScroll: 2,
		responsive: [{
		      breakpoint: 1024,
		      settings: {
		      	dots: false,
		        centerPadding: '30px',
		        initialSlide: 0,
		        infinite: true,
				slidesToShow: 1,
		        centerMode: true
		      }
	    }]
	});
	// /Slick Carousel

	// By Pages
	if ($('body').hasClass('blog-post')) {

		$('.same-articles-carousel').not('.slick-initialized').slick({
		  dots: false,
		  infinite: false,
		  speed: 300,
		  slidesToShow: 3,
		  arrows: false,
		  centerPadding: 0,
		  centerMode: true,
		  focusOnSelect: true,
		  initialSlide: 0,
		  slidesToScroll: 1,
		  responsive: [{
			      breakpoint: 1024,
			      settings: {
			        centerPadding: '30px',
			        initialSlide: 1,
			        infinite: true,
					slidesToShow: 1,
			        centerMode: true
			      }
		    }]
		});
	}
	// /By Pages

});


























