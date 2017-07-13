/*
Created by Jacques Deguest on June 2017
(c) Angels, Inc 2017
*/
$(document).ready(function() 
{
	window.l10n = 
	{
	'en-GB'	: 
	{
		'Undefined' : 'Undefined',
		'Your datetime' : 'Your current local date and time are: %(localTime) and it is %(jstTime) in Tokyo. ',
		'We are opened' : 'We are available. Feel free to call us or send us a mail and we will reply quickly.',
		'We are closed' : 'Sorry, this is outside of our business hours. Please send us a mail and we will get back to you quickly.'
		},
	'fr-FR'	: 
	{
		'Undefined' : 'Indéfini',
		'Your datetime' : 'Votre date et heure actuelles sont : %(localTime) et il est %(jstTime) à Tokyo. ',
		'We are opened' : "Nous sommes disponibles. N'hésitez pas à nous appeler ou nous envoyer un courriel et nous répondrons rapidement.",
		'We are closed' : "Désolé, c'est en dehors de nos heures de bureau. Envoyez-nous un courriel et nous vous répondrons rapidement."
		},
	'ja-JP' : 
	{
		'Undefined' : '未定義値',
		'Your datetime' : '現在、そちらの時間は%(localTime)ですが、東京は%(jstTime)です。',
		'We are opened' : '弊社営業時間内ですので、お電話もしくはメールをお送り下さい。なるべく早くご回答させて頂きます。',
		'We are closed' : '誠に申し訳ありませんが、当社の営業時間外ですので、後ほどお電話頂くか、メールをお送り下さい。なるべく早くご回答させて頂きます。'
		}
	};
	window.TZ = 'Asia/Tokyo';
	
	window.setCookie = function(cname, cvalue, exdays)
	{
		// Set expiry to 1 month by default
		if( exdays === undefined ) exdays = 30;
		var d = new Date();
		d.setTime( d.getTime() + (exdays * 24 * 60 * 60 * 1000) );
		var expires = "expires=" + d.toUTCString();
		cvalue = encodeURIComponent( JSON.stringify( cvalue ) );
		document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
	}
	
	window.getCookie = function(cname, json)
	{
		var name = cname + "=";
		var ca = document.cookie.split(';');
		var thisCookie = "";
		for(var i = 0; i < ca.length; i++)
		{
			var c = ca[i];
			while( c.charAt(0) == ' ' ) c = c.substring(1);
			if( c.indexOf(name) == 0 ) 
			{
				thisCookie = c.substring( name.length, c.length );
				break;
			}
		}
		if( thisCookie.length )
		{
			thisCookie = decodeURIComponent(thisCookie.replace(/\+/g,  " "));
			return( json ? $.parseJSON( thisCookie ) : thisCookie );
		}
		else
		{
			return( json ? {} : "" );
		}
	}
	
	window.eraseCookie = function(name) 
	{
		createCookie( name, "", -1, "/" );
	}
	
	window.propagateLang = function( selectedLang )
	{
		if( typeof( l10n[ selectedLang ] ) === 'undefined' )
		{
			return;
		}
		var langLower = new String( selectedLang ).toLowerCase();
		$(':root').attr( 'lang', selectedLang );
		if( $('input[name="lang"][value="' + selectedLang + '"]').length )
		{
			$('input[name="lang"][value="' + selectedLang + '"]').prop( 'checked', true );
		}
		$('title').text( $('title').data( langLower ) );
		$('input,textarea,select').each(function()
		{
			var eType = $(this).type || this.tagName.toLowerCase();
			var eName = $(this).attr('name');
			thisLang = new String( $(this).attr('lang') );
			if( typeof( thisLang ) != typeof( undefined ) && 
				thisLang !== false && 
				thisLang != 'undefined' &&
				thisLang.length > 0 )
			{
				if( $(this).attr('lang') == selectedLang ) 
				{
					$(this).attr( 'disabled', false );
				}
				else
				{
					$(this).attr( 'disabled', 'disabled' );
				}
			}
		});
		
		if( cookieData.lang != selectedLang )
		{
			cookieData.lang = selectedLang;
			setCookie(cookieName, cookieData);
		}
		console.log("Current lang is: " + $(':root').attr( 'lang' ).toLowerCase() );
	};
	
	function propagateThisSiteLang(lang)
	{
		if( typeof( propagateLang ) !== 'undefined' && $.isFunction( propagateLang ) )
		{
			propagateLang( lang );
			console.log( "Found " + $('div.video[lang]:visible .playVideo').length + " div[lang] visible." );
		}
		else
		{
			setTimeout( propagateThisSiteLang(lang), 500 );
		}
	}

	// To parse query string.
	// https://stackoverflow.com/questions/7731778/get-query-string-parameters-with-jquery
	window.urlParam = function(name) 
	{
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if( results == null )
		{
			return( "" );
		}
		return results[1] || 0;
	}
	
	var cookieName = 'baCookie';
	var cookieData = getCookie(cookieName, true);
	var qsLang = urlParam('lang');
	
	// Do we have a language on record?
	if( cookieData.lang && !qsLang.length )
	{
		propagateThisSiteLang( cookieData.lang );
	}
	// Try to find out from the user accepted languages
	else
	{
		var prefLang = qsLang.length ? qsLang : window.navigator.languages ? window.navigator.languages : window.navigator.userLanguage ? window.navigator.userLanguage : navigator.language ? navigator.language : '';
		var okLang;
		if( prefLang.length )
		{
			prefLang = new String( prefLang );
			console.log( "Preferred languages found are: " + prefLang );
			var a = prefLang.split( ',' );
			var b = new Array();
			for( var i = 0; i < a.length; i++ )
			{
				if( a[i].indexOf( '-' ) != -1 )
				{
					// Make sure this is in the format of en-GB and not en-gb
					var l1 = a[i].split( '-' )[0];
					var l2 = a[i].split( '-' )[1].toUpperCase();
					console.log( "Replace at offset " + i + " " + a[i] + " with " + [l1, l2].join( '-' ) );
					a.splice( i, 1, [l1, l2].join( '-' ) );
					// For ex, if en-US is found and there is no 'en' in the original list, we add 'en' at the end,
					// so this can match en-GB as an alternative
					if( a.indexOf( l1 ) == -1 )
					{
						b.push( l1 );
					}
				}
			}
			if( b.length > 0 )
			{
				a.push.apply( a, b );
			}
			console.log( "List of preferred languages now is: " + a.join( ', ' ) );
			
			for( var i = 0; i < a.length; i++ )
			{
				if( typeof( window.l10n[ a[ i ] ] ) !== 'undefined' )
				{
					okLang = a[ i ];
					console.log( "Found a valid user language: " + okLang );
					break;
				}
				else
				{
					Object.keys( window.l10n ).forEach(function(l)
					{
						console.log( "Checking " + a[i] + " against " + l );
						if( l.split('-')[0] == a[i] )
						{
							okLang = l;
							console.log( "Ok, found our language " + l + " to be a viable match." );
							return;
						}
					});
					if( typeof( okLang ) !== 'undefined' ) break;
				}
			}
		}
		if( typeof( okLang ) !== "undefined" )
		{
			propagateThisSiteLang( okLang );
		}
		else
		{
			propagateThisSiteLang( $(':root').attr( 'lang' ) );
		}
	}
	
	// If we found an activation code
	if( urlParam('c').length )
	{
		$(':root').attr( 'data-ac', urlParam('c') );
	}
	// We collected what we needed. Remove the query string now from the url
	history.pushState( '', document.title, window.location.pathname );
	
	// Enhanced css rules triggered by attributes in the html tag
	var parser = new UAParser();
	var browser = parser.getBrowser();
	var engine = parser.getEngine();
	var os = parser.getOS();
	var device = parser.getDevice();
	// Set some environmental standard values used in css
	$(':root').attr( 'data-ua-sig', navigator.userAgent );
	$(':root').attr( 'data-ua-code', navigator.appCodeName );
	// Useless piece of shit
 	// $(':root').attr( 'data-ua-name', navigator.appName );
	$(':root').attr( 'data-ua-name', parser.getBrowser().name );
	$(':root').attr( 'data-ua-platform', navigator.platform );
	$(':root').attr( 'data-ua-device', "" );
	if( typeof( parser.getDevice().type ) !== 'undefined' ) $(':root').attr( 'data-ua-device', parser.getDevice().type );
	$(':root').attr( 'data-ua-os', parser.getOS().name );

/*	
	$('nav a').on('click', function()
	{
		//var hash = window.location.hash;
		var hash = this.hash;
		console.log( "Received a click for " + hash );
		$( 'nav a' ).removeClass( 'active' );
		$(this).addClass( 'active' );
		if( $('#toggle').is(':checked' ) )
		{
			$('#toggle').prop( 'checked', false );
		}
	});
*/
	
	// Menu handling
	// Credits: Marcus Ekwall
	// url: <https://codepen.io/joxmar/pen/NqqMEg>
	// url: <https://stackoverflow.com/questions/9979827/change-active-menu-item-on-page-scroll>
	// Cache selectors
	var lastId,
	  topMenu = $('nav'),
	  topMenuHeight = $('header').outerHeight() + 1,
	  // All list items, but only anchors items as pointed out by Julian K. in StackOverflow
	  menuItems = topMenu.find( 'a' ),
	  // Anchors corresponding to menu items
	  scrollItems = menuItems.map(function()
	  {
		var item = $( $(this).attr( 'href' ) );
		if( item.length ) { return item; }
	  });

	console.log( "topMenuHeight: " + topMenuHeight + " and bap offset top is : " + $('#bap').offset().top );
	// Bind click handler to menu items
	// so we can get a fancy scroll animation
	menuItems.on('click',function(e)
	{
		e.preventDefault();
		var href = $(this).attr( 'href' );
		var hash = this.hash;
		
		console.log( "Received a click for " + hash );
		if( !$('#toggle').is(':checked' ) )
		{
			menuItems.removeClass( 'active' );
			$(this).addClass( 'active' );
		}
		else if( $(this).hasClass( 'showContact' ) )
		{
			showContact();
		}
		
		console.log( "Is mobile toggle checked? " + $('#toggle').is(':checked' ) );
		console.log( "Is the link " + href + " matching the hash " + hash + " ? " + ( href == hash ) );
		if( hash.length > 0 && href == hash )
		{
			scrollAnimate(href);
			if( window.history.pushState ) 
			{
				if( href.indexOf( document.domain ) > -1 || 
					href.indexOf(':') === -1 )
				{
					//console.log( "Adding url " + href + " to history with language " + $(':root').attr('lang') );
					window.history.pushState({"url": href, "lang": $(':root').attr('lang')}, "", href);
					//return false;
				}
			}
		}
		// If the mobile menu is opened, we close it after the click
		// This is the expected behaviour
		if( $('#toggle').is(':checked' ) )
		{
			$('#toggle').attr( 'checked', false );
		}
	});
	
	window.scrollAnimate = function(href)
	{
		var offsetTop = -1;
		if( href === '#' )
		{
			offsetTop = 0;
			console.log( "Smooth scrolling down to " + offsetTop + " for " + href );
			$('html, body').stop().animate(
			{ 
				scrollTop: offsetTop
			}, 850);
		}
		else if( $(href).length )
		{
			var checkObj = function()
			{
				if( $(href).offset().top > 0 )
				{
					console.log( "Div " + href + " is " + $(href).offset().top + " from top." );
					console.log( "offsetTop = $(href).offset().top - topMenuHeight + 1 = " + " offsetTop = " + $(href).offset().top + " - " + topMenuHeight + " + 1");
					offsetTop = $(href).offset().top - topMenuHeight + 1;
					console.log( "Smooth scrolling down to " + offsetTop + " for " + href );
					$('html, body').stop().animate(
					{ 
						scrollTop: offsetTop
					}, 850);
				}
				else
				{
					console.log( href + " still has offset to 0. Waiting 0.2 seconds." );
					setTimeout(checkObj,200);
				}
			};
			checkObj();
		}
	}

	// Bind to scroll
	$(window).scroll(function()
	{
		// Get container scroll position
		var fromTop = $(this).scrollTop()+ topMenuHeight;
   
		// Get id of current scroll item
		var cur = scrollItems.map(function()
		{
			if( $(this).offset().top < fromTop )
				return this;
		});
		// Get the id of the current element
		cur = cur[cur.length-1];
		var id = cur && cur.length ? cur[0].id : "";
		//console.log( "Processing id " + id + " versus lastId " + lastId );
   
		if( lastId !== id ) 
		{
			lastId = id;
			//console.log( "Remove class 'active' and sets it on " + id );
			// Set/remove active class
			menuItems.removeClass("active");
			menuItems.filter('[href="#' + id + '"]' ).addClass( 'active' );
	   }                   
	});
	
	// If we are called with an anchor in the url, make sure we show the corresponding menu item as selected
	if( window.location.hash.length )
	{
		var hash = window.location.hash;
		$( 'nav a' ).each(function(i,e) 
		{
			if( hash == e.hash ) 
			{ 
				$(this).addClass( 'active' );
				console.log( "Found a direct entry link to " + window.location.hash + ", moving to " + $(this).attr('href') );
				scrollAnimate( $(this).attr('href') );
			}
			else
			{
				$(this).removeClass( 'active' );
			}
		});
	}
	
	// Credits: https://codepen.io/meladq/pen/CLqtk
	// This is because of localisation we have multiple .playVideo div but only one is active, ie the one of the currently displayed language.
	$('div.video[lang] .playVideo').on('click',function()
	{
		console.log( "Got a click from this div whose language is: " + $(this).parent().parent().attr('lang') + " and who has a class of " + $(this).attr('class') );
		$(this).magnificPopup(
		{
			items: 
			{
				src: 'https://www.youtube.com/watch?v=' + $(this).data('video-id')
			},
			type: 'iframe',
			iframe: 
			{
				markup: '<div class="mfp-iframe-scaler">'+
						'<div class="mfp-close"></div>'+
						'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
						'</div>', 
				patterns: 
				{
					youtube: 
					{
						index: 'youtube.com/', 
						id: 'v=', 
						src: 'https://www.youtube.com/embed/%id%?autoplay=1&rel=0' 
					}
				},
				srcAction: 'iframe_src', 
			},
		}).magnificPopup('open');
	});

	$(document).keyup(function(e) 
	{
		var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
		if( key == 27 ) 
		{
			$('.modal').hide();
			$('#mask').hide();
		}
	});
	
	$(document).on('click', function(e)
	{
		if( $('.modal').is( ':visible' ) )
		{
			// if the target of the click isn't the container...
			if( !$('.modal').is( e.target )
				// ... nor a descendant of the container
				&& $('.modal').has( e.target ).length === 0 && 
				!$('.showMaestro').is( e.target ) &&
				!$('.showContact').is( e.target ) )
			{
				$('.modal').hide();
				$('#mask').hide();
				$('body').removeClass('noscroll');
				// No need to continue updating our availability if the contact window is not up
				if( window.AVAIL_CHECK !== 'undefined' ) clearInterval(window.AVAIL_CHECK);
			}
		}
	});
	
	$('.showMaestro').on('click', function(e)
	{
		e.preventDefault();
		// If another modal is opened, close it now.
		if( $('.modal').is( ':visible' ) )
		{
			$('.modal').hide();
		}
		$('#maestro').show();
		$('#mask').show();
		$('body').addClass('noscroll');
	});
	
	$('.modal .close, .modal .button').on('click', function()
	{
		$('.modal').hide();
		$('#mask').hide();
		$('body').removeClass('noscroll');
		if( window.AVAIL_CHECK !== 'undefined' ) clearInterval(window.AVAIL_CHECK);
	});
	
	// Does not work :-(
	// 	$('input[name=toggle]:not(:checked) ~ nav #langMenu').hoverIntent(
	$('#langMenu').hoverIntent(
	{
		over : function()
		{
			if( $('input[name=toggle]:checked').length > 0 )
			{
				return false;
			}
			$(this).attr( 'open', true );
		},
		out : function()
		{
			$(this).removeAttr( 'open' );
		},
		timeout : 500
	});
	
	$('input[name=lang]').on( 'change', function(e)
	{
		if( typeof( l10n[ $(this).val() ] ) == 'undefined' )
		{
			return false;
		}
		propagateThisSiteLang( $(this).val() );
	});
	
	window.showContact = function()
	{
		if( $('.modal').is( ':visible' ) && $('.modal').attr('id') !== 'contact' )
		{
			$('.modal').hide();
		}
		console.log( "Displaying the contact popup." );
		$('#contact').show();
		$('#mask').show();
		$('body').addClass('noscroll');
		availability();
		window.AVAIL_CHECK = setInterval(availability,60000);
	}
	
	//$('.showContact').on('click', function()
	$(document).on('click', '.showContact, .showContact span', function(e)
	{
		e.preventDefault();
		//e.stopPropagation();
		console.log( "Received a click to show the contact popup." );
		showContact();
		return false;
	});
	
	$('.courriel').on('click', function(e)
	{
		if( !$(this).data('decoded') )
		{
			e.preventDefault();
			function decode(a, r) 
			{
				return a.split( '' ).reverse().join( '' );
			};
			var y = decode( $(this).data('user') ) + '@' + decode( $(this).data('website') );
			$(this).attr("href", 'mai' + 'lto:' + y);
			$(this).data( 'decoded', true );
			window.location.href = 'mai' + 'lto:' + y;
		}
	});
	
	function getLocalDateTime()
	{
		var date = new Date();
		var d = moment.utc(date.toISOString());
		if( !sessionStorage.getItem('timezone') ) 
		{
			var tz = jstz.determine() || 'UTC';
			sessionStorage.setItem('timezone', tz.name());
		}
		var currTz = sessionStorage.getItem('timezone');
		return( d.tz(currTz) );
	}
	
    function interpolate(str, args) {
        var _str = str;
        Object.keys(args).forEach(function(arg) {
            var value = args[arg];
            var regx = new RegExp('%\\(' + arg + '\\)', 'g');
            _str = _str.replace(regx, value)
        });
        return _str;
    }

	function availability()
	{
		if( $('#contact').is(':visible') )
		{
			var d = getLocalDateTime();
			var d2 = d.clone().tz( TZ );
			d.locale( $(':root').attr( 'lang' ) );
			d2.locale( $(':root').attr( 'lang' ) );
			var localeAvailability = '';
			if( d.tz.name != TZ ) localeAvailability += interpolate( l10n[ $(':root').attr( 'lang' ) ][ 'Your datetime' ], {
                localTime: d.format( 'LLLL' ),
                jstTime: d2.format('LLLL')
            });
			if( d2.format('H') >= 9 && d2.format('H') <= 20 && 
				!( d2.format('d') == 0 || d2.format('d') == 1 ) )
			{
				localeAvailability += l10n[ $(':root').attr( 'lang' ) ][ 'We are opened' ];
			}
			else
			{
				localeAvailability += l10n[ $(':root').attr( 'lang' ) ][ 'We are closed' ];
			}
			$('.availability').html( localeAvailability );
		}
	}
	
	$(window).on("popstate", function(e)
	{
		var data = e.originalEvent.state;
		if( data !== null ) 
		{
			var lang = data.lang;
			//console.log( "Found page " + data.url + " with language " + data.lang );
			if( lang != $(':root').attr( 'lang' ) )
			{
				//console.log( "Language in history (" + data.lang + ") is different than our current one, changing." );
				propagateLang( lang );
			}
		}
	});
	
	$('#sponsors').magnificPopup(
	{
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom mfp-img-mobile',
		image: 
		{
			verticalFit: true,
			titleSrc: function(item) 
			{
				var curLang = $(':root').attr('lang');
				console.log( "Checking sponsor title in locale lang " + curLang );
				var locTitle = item.el.attr( 'data-title-' + curLang );
				var caption;
				if( typeof( locTitle ) !== 'undefined' && locTitle !== false )
				{
					caption = item.el.attr( 'data-title-' + curLang );
				}
				else
				{
					caption = item.el.attr( 'data-title-en-GB' );
				}
				return '<a class="sponsor-link" href="' + item.el.attr('data-link') + '" target="_blank">' + caption + '</a>';
			}
		},
		gallery: 
		{
			enabled: true
		},
		zoom: 
		{
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) 
			{
				return element.find('img');
			}
		}
		
	});
});
