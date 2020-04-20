$(function () {
  "use strict";

  //===== Prealoder

  $(window).on("load", function (event) {
    $("#preloader").delay(500).fadeOut(500);
  });

  //===== Mobile Menu

  $(".navbar-toggler").on("click", function () {
    $(this).toggleClass("active");
  });

  $(".navbar-nav a").on("click", function () {
    $(".navbar-toggler").removeClass("active");
  });

  //===== close navbar-collapse when a  clicked

  $(".navbar-nav a").on("click", function () {
    $(".navbar-collapse").removeClass("show");
  });

  //===== Sticky

  $(window).on("scroll", function (event) {
    var scroll = $(window).scrollTop();
    if (scroll < 10) {
      $(".navgition").removeClass("sticky");
    } else {
      $(".navgition").addClass("sticky");
    }
  });

  //===== Section Menu Active

  var scrollLink = $(".page-scroll");
  // Active link switching
  $(window).scroll(function () {
    var scrollbarLocation = $(this).scrollTop();

    scrollLink.each(function () {
      var sectionOffset = $(this.hash).offset().top - 90;

      if (sectionOffset <= scrollbarLocation) {
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
      }
    });
  });

  //====== Magnific Popup

  $(".video-popup").magnificPopup({
    type: "iframe",
    // other options
  });

  //===== Back to top

  // Show or hide the sticky footer button
  $(window).on("scroll", function (event) {
    if ($(this).scrollTop() > 600) {
      $(".back-to-top").fadeIn(200);
    } else {
      $(".back-to-top").fadeOut(200);
    }
  });

  //Animate the scroll to yop
  $(".back-to-top").on("click", function (event) {
    event.preventDefault();

    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1500
    );
  });

  //=====

  var faqData = [
    {
      Que:
        "I'm from a Non-IT Stream with less then 60% aggregate in my academics, am i eligible for this? and meanwhile how many interviews do i get if i finish this course?",

      Ans:
        "Yes you are eligible for this program , there is no restriction for NON-IT streams as well for the one who scored less than 60% aggregate. and definetly all students will get ample amount of interview opportunities irrespective of stream and percentage.",
    },
    {
      Que:
        "If i don't get selected in Spiders entrance test. still i want to join this program ,is there any way to do that ?",
      Ans:
        "Be Positive, still you can do that for more details contact:9980600900 ",
    },

    {
      Que: "What is the criteria to get interview opportunities?",
      Ans:
        "There Will be regular assesment tests , based on the performance in assesment test you do get interview opportunities.",
    },
    {
      Que:
        "If I miss the class(due to technical/health issues), do I get backup?",
      Ans: "Yes, within 3 days you can watch that online session again.",
    },
    {
      Que: "After getting job , can I enroll to any upgraded courses?",
      Ans:
        " yes, you can enroll for Artificial Intrligence and machine learning course which really helps you in professional growth.",
    },

    {
      Que:
        "If I get the job in between the course, how about the completion of course?",
      Ans: " you can continue the course in weekend batches.",
    },
    {
      Que:
        "If i get placed in a company, can I get chance to attend another one?",
      Ans: "No",
    },
    {
      Que:
        " Will I get official certification from the institute and can I project it during interviews?",
      Ans: "Yes you will get a valid certification from the institute.",
    },
    {
      Que:
        "knowledge you provide , will it helps to just crack the interviews or sustain in the company.?",
      Ans:
        " Definetly it will help you to crack interviews as well as to sustain in the company",
    },
    {
      Que: "is syllabus revised as per the present IT requirements?",
      Ans: " Syllabus will be recuringly revised as per IT Requirements",
    },
    {
      Que: "is there any fastrack courses?",
      Ans: "Yes Fastrack course available. for more details contact:9980600900",
    },
    {
      Que: "is it possible to pause course due to final semester  exams?",
      Ans: "Yes possible, but you have to attend next batch.",
    },
    {
      Que: "since this is online course how can i clarify my doubts.?  ",
      Ans: "every weekend there will be live support from dedicated faculties.",
    },
    {
      Que: "will i be having online assesments.?",
      Ans: " every weekend you will be having assesment test.",
    },
    {
      Que:
        "i am 2018 passed out, am i elegible for this and do i get any placement opportunities?",
      Ans:
        " Yes but not exactly in this program, for more information please contact:9980600900",
    },
    {
      Que: "Will I get personal attention?",
      Ans:
        "Each and everyone in the batch will get personal attention from dedicated faculties.",
    },
  ];

  faqData.forEach((element, i) => {
    $("#accordion").append(
      `
    <div class="card">
    <div class="card-header" id="heading` +
        i +
        `">
      <h5 class="mb-0">
        <button class="btn btn-light btn-block" data-toggle="collapse" data-target="#collapse` +
        i +
        `" aria-expanded="true" aria-controls="collapse` +
        i +
        `">
        ` +
        element.Que +
        `
        </button>
      </h5>
    </div>

    <div id="collapse` +
        i +
        `" class="collapse" aria-labelledby="heading` +
        i +
        `" data-parent="#accordion">
      <div class="card-body text-center">
` +
        element.Ans +
        `
      </div>
    </div>
  </div>


`
    );
  });

  //   setTimeout(() => {
  //     var i = 0;
  //     const inter = setInterval(() => {
  //       i = i + 1;
  //       if (i >= 501) {
  //         clearInterval(inter);
  //       }
  //       var data = JSON.stringify({
  //         name: "chirag lodha",
  //         email: "jainchirag172@gmail.com",
  //         phonenumber: "7568835897",
  //         education: "BTech",
  //         college: "jh",
  //         yearOfCompletion: 2017,
  //       });
  //       $.ajax({
  //         type: "POST",
  //         contentType: "application/json",
  //         url: "http://localhost:7000/auth/register",
  //         data: data,
  //         success: function (s) {
  //           console.log(s);
  //         },
  //         error: function (err) {
  //           console.log(err);
  //         },
  //         // dataType: dataType
  //       });
  //     }, 3000);
  //   }, 10000);
});
