// when clicking on Save Recipe btn saves receipe
$(document).on('click', '.saveBtn', function () {
    // grabs the id associated with the recipe from the save button
    var recipeId = $(this).attr('data-id');
    // sends a PUT request to save the recipe
    $.ajax({
        method: 'PUT',
        url: '/recipes/' + recipeId
    }).done(function (data) {
        console.log('Recipe Saved!')
    })
})

// when clicking on Delete Recipe btn deletes saved recipe
$(document).on('click', '.deleteBtn', function () {
    // grabs the id associated with the recipe from the delete button
    var recipeId = $(this).attr('data-id');
    // removes the whole recipe container
    $(this).closest('.recipe-container').remove();
    // sends a PUT request to delete the saved recipe
    $.ajax({
        method: 'PUT',
        url: '/recipes/delete/' + recipeId
    }).done(function (data) {
        console.log('Recipe Removed!')
    })

})

// when clicking on Reviews btn the review modal pops up with the list of reviews
$(document).on('click', '.reviewBtn', function () {
    // grabs the id associated with the recipe from the reviews button
    var recipeId = $(this).attr('data-id');
    // makes an ajax call for the Recipe
    $.ajax({
        method: 'GET',
        url: '/recipes/' + recipeId
    })
        // with that done, add the reviews to the modal
        .done(function (data) {
            console.log('Gets all Reviews!');
            // gets recipe title for the modal title
            $('#reviewTitle').text(data.title);
            // sets data-id for Submit Review btn
            $('#saveReview').attr('data-id', data._id);
            // empies the reviews container before loading
            $('#reviews').empty();
            // gets all reviews for one recipe
            for (var i = 0; i < data.reviews.length; i++) {
                $('#reviews').append(`<li class='list-group-item d-flex justify-content-between align-items-center'>` +
                    `${data.reviews[i].body}<a href='#' class='badge badge-pill badge-danger delete-review' data-id='` +
                    `${data.reviews[i]._id}'>&times;</a></li>`);
            }

        });
});

// when clicking the Submit Review button
$(document).on('click', '#saveReview', function () {
    // grabs the id associated with the recipe from the submit button
    var recipeId = $(this).attr('data-id');
    // makes a POST request to add the review, based on the input
    $.ajax({
        method: 'POST',
        url: '/recipes/' + recipeId,
        data: {
            // gets value from review textarea
            body: $('#bodyinput').val()
        }
    })
        .done(function (data) {
            console.log(data);
            // emptys the reviews section
            $('#reviews').empty();
            // populates reviews
            for (var i = 0; i < data.reviews.length; i++) {
                $('#reviews').append(`<li class='list-group-item d-flex justify-content-between align-items-center'>` +
                    `${data.reviews[i].body}<a href='#' class='badge badge-pill badge-danger delete-review' data-id='` +
                    `${data.reviews[i]._id}'>&times;</a></li>`);
            }
        });

    // removes the value entered in the textarea for review entry
    $('#bodyinput').val('');
});

// when clicking on a Delete Review X button, delete review
$(document).on('click', '.delete-review', function () {
    // grabs the id associated with the review from the x button
    var reviewId = $(this).attr('data-id');
    // removes the review container
    $(this).parent().remove();
    // makes an ajax call to request deleting a review 
    $.ajax({
        method: 'DELETE',
        url: '/review/delete/' + reviewId,
    })
        .done(function (data) {
            console.log(data, 'Review is Deleted!');
        });
})
