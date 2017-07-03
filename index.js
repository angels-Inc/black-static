$(document).ready(function() 
{
	window.l10n = 
	{
	'en-GB'	: 
	{
		'Undefined' : 'Undefined',
		'Your datetime' : 'Your current local date and time are: %s and it is %s in Tokyo. ',
		'We are opened' : 'We are available. Feel free to call us or send us a mail and we will reply quickly.',
		'We are closed' : 'Sorry, this is outside of our business hours. Please send us a mail and we will get back to you quickly.'
		},
	'fr-FR'	: 
	{
		'Undefined' : 'Indéfini',
		'Your datetime' : 'Votre date et heure actuelles sont : %s et il est %s à Tokyo. ',
		'We are opened' : "Nous sommes disponibles. N'hésitez pas à nous appeler ou nous envoyer un courriel et nous répondrons rapidement.",
		'We are closed' : "Désolé, c'est en dehors de nos heures de bureau. Envoyez-nous un courriel et nous vous répondrons rapidement."
		},
	'ja-JP' : 
	{
		'Undefined' : '未定義値',
		'Your datetime' : '現在、そちらの時間は%sですが、東京では%sになっております。',
		'We are opened' : '弊社営業時間内ですので、ぜひご架電もしくはメールを配信してください。早くご回答させていただくよう努力します。',
		'We are closed' : 'すみませんが、営業時間外ですので、後ほどご架電していただくか、メールの配信していただければ早くご回答させていただくよう努力します。'
		}
	};
	window.TZ = 'Asia/Tokyo';
	
	// If we are called with an anchor in the url, make sure we show the corresponding menu item as selected
	if( window.location.hash.length )
	{
		var hash = window.location.hash;
		$( 'nav a' ).each(function(i,e) 
		{
			if( hash == e.hash ) 
			{ 
				$(this).addClass( 'active' );
			}
			else
			{
				$(this).removeClass( 'active' );
			}
		});
	}
	
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
		var langLower = new String( selectedLang ).toLowerCase();
		$(':root').attr( 'lang', selectedLang );
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
	};
	
	var cookieName = 'baCookie';
	var cookieData = getCookie(cookieName, true);
	if( cookieData.lang )
	{
		propagateLang( cookieData.lang );
	}
	
	$('nav a').on('click', function()
	{
		//var hash = window.location.hash;
		var hash = $(this).hash;
		$( 'nav a' ).each(function(i,e) 
		{
            // checks if its the same on the address bar
			if( hash != e.hash ) 
			{ 
				$(this).removeClass( 'active' );
			}
		});
		$(this).addClass( 'active' );
	});
	
	propagateThisSiteLang();
	function propagateThisSiteLang()
	{
		if( typeof( propagateLang ) !== 'undefined' && $.isFunction( propagateLang ) )
		{
			propagateLang( $(':root').attr('lang') );
			if( $('input[name="lang"][value="' + $(':root').attr('lang') + '"]').length )
			{
				$('input[name="lang"][value="' + $(':root').attr('lang') + '"]').prop( 'checked', true );
			}
		}
		else
		{
			setTimeout( propagateThisSiteLang, 1000 );
		}
	}
	
	if( typeof( l10n[ $(':root').attr( 'lang' ) ] ) != 'undefined' )
	{
		propagateLang( $(':root').attr( 'lang' ) );
	}
	
	// Credits: https://codepen.io/meladq/pen/CLqtk
	$('.playVideo').magnificPopup(
	{
		items: 
		{
			src: 'https://www.youtube.com/watch?v=' + $('.playVideo').data('video-id')
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
		}
	});

	$(document).keyup(function(e) 
	{
		var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
		if( key == 27 ) 
		{
// 			document.location='#bap';
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
				!$('#showMaestro').is( e.target ) &&
				!$('.showContact').is( e.target ) )
			{
				$('.modal').hide();
				$('#mask').hide();
				// No need to continue updating our availability if the contact window is not up
				if( window.AVAIL_CHECK !== 'undefined' ) clearInterval(window.AVAIL_CHECK);
			}
		}
	});
	$('#showMaestro').on('click', function(e)
	{
		e.preventDefault();
		// If another modal is opened, close it now.
		if( $('.modal').is( ':visible' ) )
		{
			$('.modal').hide();
		}
		$('#maestro').show();
		$('#mask').show();
	});
	
	$('.modal .close, .modal .button').on('click', function()
	{
		$('.modal').hide();
		$('#mask').hide();
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
		propagateLang( $(this).val() );
	});
	
	$('.showContact').on('click', function()
	{
		if( $('.modal').is( ':visible' ) )
		{
			$('.modal').hide();
		}
		$('#contact').show();
		$('#mask').show();
		availability();
		window.AVAIL_CHECK = setInterval(availability,60000);
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
	
	function availability()
	{
		if( $('#contact').is(':visible') )
		{
			var d = getLocalDateTime();
			var d2 = d.clone().tz( TZ );
			d.locale( $(':root').attr( 'lang' ) );
			d2.locale( $(':root').attr( 'lang' ) );
			var localeAvailability = '';
			if( d.tz.name != TZ ) localeAvailability += sprintf( l10n[ $(':root').attr( 'lang' ) ][ 'Your datetime' ], d.format( 'LLLL' ), d2.format('LLLL') );
			if( d2.format('H') >= 9 && d2.format('H') <= 20 && 
				!( d2.format('d') == 0 || d2.format('d') == 1 ) )
			{
				localeAvailability += l10n[ $(':root').attr( 'lang' ) ][ 'We are opened' ];
			}
			else
			{
				localeAvailability += l10n[ $(':root').attr( 'lang' ) ][ 'We are closed' ];
			}
			$('#availability').html( localeAvailability );
		}
	}
	
	// Menu handling
	// Credits: Marcus Ekwall
	// url: <https://codepen.io/joxmar/pen/NqqMEg>
	// url: <https://stackoverflow.com/questions/9979827/change-active-menu-item-on-page-scroll>
	// Cache selectors
	var lastId,
	  topMenu = $('nav'),
	  topMenuHeight = topMenu.outerHeight() + 1,
	  // All list items, but only anchors items as pointed out by Julian K. in StackOverflow
	  menuItems = topMenu.find( 'a[href^="#"]' ),
	  // Anchors corresponding to menu items
	  scrollItems = menuItems.map(function()
	  {
		var item = $( $(this).attr( 'href' ) );
		if( item.length ) { return item; }
	  });

	// Bind click handler to menu items
	// so we can get a fancy scroll animation
	menuItems.click(function(e)
	{
		var href = $(this).attr( 'href' ),
		offsetTop = href === '#' ? 0 : $(href).offset().top-topMenuHeight + 1;
		$('html, body').stop().animate(
		{ 
			scrollTop: offsetTop
		}, 850);
		e.preventDefault();
	});

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
});
