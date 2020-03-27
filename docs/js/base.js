import $ from 'jquery';
import moment from 'moment';
import {lory} from 'lory.js';
import tingle from 'tingle.js';
import mlStackNav from 'ml-stack-nav';
//import { Features, Zoom, ZoomDOM, ZoomListener } from 'zoom.ts';

window.tingle = tingle;

const defaults = {
  sortOrder: 'desc'
};

const hoverIn = function(e) {
  $(e.currentTarget).find('.dropdown-menu').addClass('dropdown-show');
};

const hoverOut = function(e) {
  $(e.currentTarget).find('.dropdown-menu').removeClass('dropdown-show');
};

const bootstrapDropdowns = function() {
  let $toggles = $('.dropdown');
  $toggles.each((idx, el) => {
    $(el).hover(hoverIn, hoverOut);
  });
}

const bootstrapModals = function() {
  $(document).on('click', '.modal-open', (e) => {
    let wrapperId = $(e.currentTarget).data('launch-id');
    let wrapper = $(`#${wrapperId}`);

    let content = wrapper.find('div.content');
    let classes = wrapper.find('.css-classes').data('css-classes');
    let classList = [];
    if ( classes && classes.length ) {
      classList = classes.split(',');
    }

    var modal = new tingle.modal({
      footer: !!wrapper.find('.include-footer').data('include-footer'),
      stickyFooter: !!wrapper.find('.include-footer').data('sticky-footer'),
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: wrapper.find('.include-footer').data('close-label') || "Close",
      cssClass: classList || "",
      onOpen: () => {
        console.log('Modal opened');
      },
      onClose: () => {
        console.log('Modal closed');
      },
      beforeClose: () => {
        content.detach()
        wrapper.append(content);
        return true;
      }
    });

    // set content
    content.detach();
    modal.setContent(content[0]);

    // add a button
    let label = wrapper.find('.footer-button-label').data('footer-label');
    if ( label ) {
      modal.addFooterBtn(label, 'tingle-btn tingle-btn--primary', function() {
        // here goes some logic
        modal.close();
      });
    }

    modal.open();
  });
}

const bootstrapSlider = function() {
  //http://meandmax.github.io/lory/
  // EVENTS
  // before.lory.init
  // fires before initialisation (first in setup function)
  // after.lory.init
  // fires after initialisation (end of setup function)
  // before.lory.slide
  // arguments: currentSlide, nextSlide
  // fires before slide change
  // after.lory.slide
  // arguments: currentSlide
  // fires after slide change
  // before.lory.destroy
  // fires before the slider instance gets destroyed
  // after.lory.destroy
  // fires after the slider instance gets destroyed
  // on.lory.resize
  // fires on every resize event
  // on.lory.touchstart
  // fires on every slider touchstart event
  // on.lory.touchmove
  // fires on every slider touchmove event
  // on.lory.touchend
  // fires on every slider touchend event
  // var slider = document.querySelector('.js_slider');

  $('.js_slider').each((idx, slider) => {
    if (slider) {
      lory(slider, {
        // options going here
        // infinite: 4,
        // slidesToScroll: 1,
        // enableMouseEvents: false,
        // rewind: false,
        // slideSpeed: 300,
        // rewindSpeed: 600,
        // snapBackSpeed: 200,
        // initialIndex: 0,
        // ease: 'ease',
        // classNameFrame: 'js_frame',
        // classNameSlideContainer: 'js_slides',
        // classNamePrevCtrl: 'js_prev',
        // classNameNextCtrl: 'js_next',
      });
    }
  });

}

const bootstrapSorts = function() {
  if (window.location.pathname.includes('events')) {
    $('.sort-button').on('click', (el)=> {
      let sortBy    = $(el.currentTarget).data('sort-by');
      let $wrapper  = $('.current-events-list-container');
      let $nodes    = $wrapper.children('.box');
      let htmlOut   = '';
      let sortOrder = defaults.sortOrder;

      let sorted = $nodes.sort((a,b) => {
        if (sortBy === 'eventDate') {
          if (sortOrder === 'asc') {
            return moment($(a).data(sortBy)).isAfter($(b).data(sortBy));
          } else {
            return moment($(a).data(sortBy)).isBefore($(b).data(sortBy));
          }
        }
        if (sortBy === 'eventTitle') {
          if (sortOrder === 'asc') {
            return $(a).data(sortBy) > $(b).data(sortBy);
          } else {
            return $(a).data(sortBy) < $(b).data(sortBy);
          }
        }
      });

      if (sortOrder === 'asc') {
        defaults.sortOrder = 'desc';
      } else {
        defaults.sortOrder = 'asc';
      }

      sorted.each((idx, evt) => {
        htmlOut += evt.outerHTML;
      });
      $wrapper.html(htmlOut);
    })
  }
}

const toggleNav = function(input, mode="toggle"/*show, hide*/) {
  let $target = $(input);
  let children = $target.find('>UL');
  let icon = $target.find('>.expand-toggle');

  let show = ((mode === 'toggle' && children.hasClass('hide')) || mode === 'show' );

  if (children.length > 0) {
    if ( show ) {
      children.removeClass('hide');
      icon.html('indeterminate_check_box');
    } else {
      children.addClass('hide');
      icon.html('add_box');
    }
  }

  if ( show ) {
    let parent = $target.parent().parent();
    if ( parent && parent.length ) {
      toggleNav(parent, 'show');
    }

    $target.addClass('open');
  } else {
    $target.removeClass('open');
  }
}

const bootstrapNav = function () {
  // mobile nav
  // init-attaches to js object
  mlStackNav();
  // consume
  $(".js-ml-stack-nav").mlStackNav();

  // sidenav
  $('.tree-nav').on('click', '.tree-nav-item', function(e) {
    // actual clicked element
    let target = e.target;

    if (target.href) {
      return;
    }

    // stop it from affecting other nodes
    e.preventDefault();
    e.stopPropagation();

    toggleNav(e.currentTarget);
  });

  // expand the current page
  let cur = $('.tree-nav A[href="'+window.location.pathname+'"]').closest('LI');
  cur.addClass('active');
  toggleNav(cur, 'show');
  $('.tree-nav').removeClass('invisible');
}

const bootstrapScrollSpy = function () {
  $(window).resize(scrollHandler)

  $(window).scroll(scrollHandler)

  function scrollHandler() {
    let $class             = 'sticky';
    let $el                = $('.toc-container');
    let $watch             = $('.offset-watch');

    if ( !$watch.length ) {
      return;
    }

    let scrollTop          = $(window).scrollTop();
    let elementOffset      = $watch.offset().top;
    let distance           = (elementOffset - scrollTop);
    let $mainContentHeaders = $('.main-content').find(':header:visible');
    let opts               = {
      height: "100vh",
      width:  $el.outerWidth(),
      left:   $el.offset().left,
    };

    for (var i = 0; i <= $mainContentHeaders.length - 1; i++) {

      if ($($mainContentHeaders[i]).attr('id')) {
        var $mainContentHeadersEl = $(`#${$mainContentHeaders[i].id}`);
        var hTop                  = $mainContentHeadersEl.offset().top;

        if (hTop - scrollTop >= 0) {

          $mainContentHeaders.each( ( i, a ) => {
            if ($(a).attr('id')) {
              $('#TableOfContents').find(`a[href$=${a.id}]`).removeClass('active');
            }
          });

          $('#TableOfContents').find(`a[href$=${$mainContentHeaders[i].id}]`).addClass('active');

          break;
        }
      } else {
        break;
      }
    }


    if (distance <= 0) {

      $el.css(opts);
      $el.addClass($class)

    } else if (distance >= 0){

      $el.removeClass($class)

    }

  }

  //init position
  scrollHandler();
}

const bootstrapImgZoom = function() {
  let features = Features.of(document.body.style); // (1)
  let image = document.querySelector('.zoom__image'); // (2)

  if (image) {
    image.addEventListener('click', new ZoomListener(dom => { // (3)
      let zoom = new Zoom(dom, features); // (4)

      zoom.expand(); // (5)

      // this probably isn't required at this point because its not a single page app but lets be safe
      setTimeout(() => {
        zoom.destroy(); // (6)
      }, 5000);
    }));
  }
}

const bootstrapApp = function() {
  bootstrapNav();
  bootstrapDropdowns();
  bootstrapModals();
  bootstrapSorts();
  bootstrapSlider();
  bootstrapScrollSpy();
  //bootstrapImgZoom();
}

$(document).ready(() => {
  bootstrapApp();
});

export default bootstrapApp;

//tab functionality
$(document).ready(() => {
  $('.tab-content').find('.tab-pane').each(function(idx, item) {
    var navTabs = $(this).closest('.content-tabs').find('.nav-tabs'),
        title = $(this).attr('title');
    navTabs.append('<li><a href="#">'+title+'</a></li');
  });

  $('.content-tabs ul.nav-tabs').each(function() {
    $(this).find("li:first").addClass('active');
  })

  $('.content-tabs .tab-content').each(function() {
    $(this).find("div:first").addClass('active');
  });

  $('.nav-tabs a').click(function(e){
    e.preventDefault();
    var tab = $(this).parent(),
        tabIndex = tab.index(),
        tabPanel = $(this).closest('.content-tabs'),
        tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
    tabPanel.find('.active').removeClass('active');
    tab.addClass('active');
    tabPane.addClass('active');
  });
});
