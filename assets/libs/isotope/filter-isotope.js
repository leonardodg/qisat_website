// external js: isotope.pkgd.js
$(document).ready(function() {

  function getHashFilter() {
    var hash = location.hash;
    // get filter=filterName
    var matches = location.hash.match(/filtro=([^&]+)/i);
    var hashFilter = matches && matches[1];
    return hashFilter && decodeURIComponent(hashFilter);
  }

  // init Isotope
  var $grid = $('#container-isotope').isotope({
    itemSelector: '.isotope_content-item'
  }).masonry({
      itemSelector: '.isotope_content-item',
  });;

  // store filter for each group
  var filters = {};



  $('.isotope_filters').on('click', '.isotope_filter-item', function() {
    var $this = $(this);
    // get group key
    var $buttonGroup = $this.parents('.isotope_filter-option-set');
    var filterGroup = $buttonGroup.attr('data-filter-group');
    // set filter for group
    filters[filterGroup] = $this.attr('data-filter');
    // combine filters
    var filterValue = concatValues(filters);
    // set filter for Isotope
    ///////////////////////////////////$grid.isotope({ filter: filterValue });

    location.hash = 'filtro=' + encodeURIComponent(filterValue);

  });

  // change is-checked class on buttons
  $('.isotope_filter-option-set').each(function(i, buttonGroup) {
    var $buttonGroup = $(buttonGroup);
    $buttonGroup.on('click', '.isotope_filter-item', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $(this).addClass('is-checked');
    });
  });

  var isIsotopeInit = false;

  function onHashchange() {
    var hashFilter = getHashFilter();
    if (!hashFilter && isIsotopeInit) {
      return;
    }
    isIsotopeInit = true;
    // filter isotope
    $grid.isotope({
      itemSelector: '.isotope_filter-item',
      //filter: hashFilter || filterValue
      filter: hashFilter
    });
    // set selected class on button
    if (hashFilter) {

    //  $buttonGroup.find('.is-checked').removeClass('is-checked');
    //  $buttonGroup.find('[data-filter="' + hashFilter + '"]').addClass('is-checked');

    }
  }

  $(window).on('hashchange', onHashchange);
  // trigger event handler to init Isotope
  onHashchange();

});

// flatten object by concatting values
function concatValues(obj) {
  var value = '';
  for (var prop in obj) {
    value += obj[prop];
  }
  return value;
}

////////////////////////////////////////////////////


 
