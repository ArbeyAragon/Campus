////////////////////////////////////////////////////////// MORALIS////////////////////////////////////////////////////////



// Playing with Moralis. The code is messy. That was quick coding.

(function () {
  // Moralis keys - replace them with yours, only my user can add to the collection with this setup
  const MORALIS_APP_ID = "hXxP8Ig7bQj7q91Ez34jL9AvpdDXOLrArYjVOsPG";
  const MORALIS_SERVER = "https://orlte49tvxzm.usemoralis.com:2053/server";

  const nft_contract_address = "0x4531BFCdf3033286Bc7E1EA5D50dD241635adff8"; //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.

  // Adjust collection names according to your Moralis database configuration
  const NOTES_COLLECTION_NAME = "JULNotes";
  const FILES_COLLECTION_NAME = "JULFiles";
  const CHAIN_ID = "goerli"; // Ethereum testnet chain

  const registrationBothButton = document.getElementById("registrationBoth");
  const loginCriptoButton = document.getElementById("loginCripto");
  const logoutButton = document.getElementById("logout");
  const generateNFTButton = document.getElementById("generateNFT");

  
  const uploadimageButton = document.getElementById("uploadimage");
  const uploadfilesButton = document.getElementById("uploadfiles");

  const userAddress = document.getElementById("user-address");

  const transactionsContainer = document.getElementById("transactions-list");
  const loggedInSection = document.getElementById("for-logged-in-user");
  const notesContainer = document.getElementById("notes-container");
  const addNewNoteButton = document.getElementById("add-new-note-button");
  const addNewNoteTextarea = document.getElementById("add-new-note-textarea");
  const fileInput = document.getElementById("file-input");
  const imagesWrapper = document.getElementById("images-wrapper");

  Moralis.initialize(MORALIS_APP_ID);
  Moralis.serverURL = MORALIS_SERVER;
  const web3 = new Moralis.Web3();
  const web3eth = new Web3(window.ethereum);

  var imagedata = {};
  var ipfsUris = {};
  var haveImageData = false;
  var haveIpfsUris = false;



  registrationBothButton.addEventListener("click", async function () {
    const user = await Moralis.authenticate({ provider: "metamask" });
    user.set("username", document.getElementById("username").value);
    user.set("password", document.getElementById("password").value);
    user.set("email", document.getElementById("email").value);
    try {
      await user.signUp();
      console.log("registrationButton");
    } catch (error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  loginCriptoButton.addEventListener("click", async function () {
    console.log("-------------");
    try {
      const user = await Moralis.authenticate({ provider: "metamask" });
      console.log("loginCriptoButton");
      switchLoginStateInUI(user);
      handleNotes();
      handleFileInput();
    } catch (error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  

  logoutButton.addEventListener("click", async function () {
    try {
      const user = await Moralis.User.logOut();
      console.log("logoutButton");
      switchLoginStateInUI(null);
    } catch (error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  uploadimageButton.addEventListener("click", async function () {
    const fileInput = document.getElementById("imagefile");
    var i = 0;
    console.log(fileInput.files[i].name);
    let data = fileInput.files[i];
    let imageFile = new Moralis.File(data.name, data);
    await imageFile.saveIPFS();
    imagedata = {
      "image_uri": imageFile.ipfs(),
      "image_name": fileInput.files[i].name,
    }
    haveImageData = true;
    console.log(imagedata);
  });

  uploadfilesButton.addEventListener("click", async function () {
    const fileInput = document.getElementById("files");
    for (i = 0; i < fileInput.files.length; i++) {
      console.log(fileInput.files[i].name);
      let data = fileInput.files[i];
      console.log(data.name);

      let imageFile = new Moralis.File(data.name, data);
      await imageFile.saveIPFS();
      ipfsUris['file_'+(i + 1)] = data.name + ';' + imageFile.ipfs();
    }
    haveIpfsUris = true;
    console.log(ipfsUris);
  });

  

  generateNFTButton.addEventListener("click", async function () {
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;

    const metadata = {
      "name": name,
      "version": "1.2.0",
      "description": description,
      ...imagedata,
      ...ipfsUris
    }
    console.log("########################################");
    console.log(metadata);

    
    if(haveImageData && haveIpfsUris){
      let text = "Press a button!\nEither OK or Cancel.";
      if (confirm(text) == true) {
        text = "You pressed OK!";
        const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
        await metadataFile.saveIPFS();
        const metadataURI = metadataFile.ipfs();
        const txt = await mintToken(metadataURI).then(console.log)
      } else {
        text = "You canceled!";
      }
      document.getElementById("demo").innerHTML = text;
    }
  });



  async function mintToken(_uri) {
    const encodedFunction = web3eth.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: "string",
            name: "tokenURI",
            type: "string",
          },
        ],
        name: "mintToken",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      [_uri]
    );

    const transactionParameters = {
      to: nft_contract_address,
      from: ethereum.selectedAddress,
      data: encodedFunction,
    };
    const txt = await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return txt;
  }
})();


/////FORM SIGNUP

function validateform(){  
  var username=document.myform.username.value;  
  var email=document.myform.email.value;  
  var password=document.myform.password.value;  
    
  if (username==null || username==""){  
    alert("please enter username");  
    return false;  
  }if (email==null || email==""){  
    alert("please enter email"); 
    return false;  
  }else if(password ==null || password==""){  
    alert("please enter password");
    return false;  
    }  
  }  






///////////////////////////////////////PAGE//////////////////////////////////

jQuery(document).ready(function( $ ) {

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Header fixed on scroll
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Real view height for mobile devices
  if (window.matchMedia("(max-width: 767px)").matches) {
    $('#intro').css({ height: $(window).height() });
  }

  // Initiate the wowjs animation library
  new WOW().init();

  // Initialize Venobox
  $('.venobox').venobox({
    bgcolor: '',
    overlayColor: 'rgba(6, 12, 34, 0.85)',
    closeBackground: '',
    closeColor: '#fff'
  });

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if( ! $('#header').hasClass('header-fixed') ) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Gallery carousel (uses the Owl Carousel library)
  $(".gallery-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    center:true,
    responsive: { 0: { items: 1 }, 768: { items: 3 }, 992: { items: 4 }, 1200: {items: 5}
    }
  });

  // Buy tickets select the ticket type on click
  $('#buy-ticket-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var ticketType = button.data('ticket-type');
    var modal = $(this);
    modal.find('#ticket-type').val(ticketType);
  })

// custom code

});


