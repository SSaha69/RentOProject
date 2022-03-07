$(document).ready(function(){
  		$('#review1').click(function(){
  			 $("#review2").addClass("active");
  			 $("#_desc").removeClass("active");
  			 $([document.documentElement, document.body]).animate({
                scrollTop: $("#product-tab").offset().top
                }, 1000);
  			 
  		})

  	})