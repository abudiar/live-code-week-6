$(document).ready(function () {
    if (localStorage.getItem('access_token')) {
        showListFoods();
    }
    else {
        showLogin();
    }

    $('#logout').click(function () {
        localStorage.removeItem('access_token');
        hideAll();
        $('#login-container').show();
    })

    $('#login-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:3000/login',
            method: 'POST',
            data: {
                email: $('#exampleInputEmail1').val(),
                password: $('#exampleInputPassword').val(),
            }
        })
            .done(function (result) {
                // console.log(result)
                localStorage.setItem('access_token', result.access_token);
                showListFoods();
            })
            .fail(function (result) {
                console.log(result);
                toastr.error(result.responseJSON.message, result.responseJSON.name)
            });
    })

    $('#add-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:3000/foods',
            method: 'POST',
            headers: { access_token: localStorage.getItem('access_token') },
            data: {
                "title": $('#title').val(),
                "price": $('#price').val(),
                "ingredients": $('#ingredients').val(),
                "tag": $('#tag').val()
            }
        })
            .done(function (result) {
                showListFoods();
            })
            .fail(function (result) {
                console.log(result);
                toastr.error(result.responseJSON.message, result.responseJSON.name)
            });
    })
});

function showLogin() {
    $('#exampleInputEmail1').val('');
    $('#exampleInputPassword').val('');
    hideAll();
    $('#login-container').show();
}

function showListFoods() {
    $('#title').val('')
    $('#price').val('')
    $('#ingredients').val('')
    $('#tag').val('')

    $('#list-food').html('');
    $.ajax({
        url: 'http://localhost:3000/foods',
        method: 'GET',
        headers: { access_token: localStorage.getItem('access_token') }
    })
        .done(function (result) {
            console.log(result)
            for (let i in result) {
                $('#list-food').append(`
                <div class="card">
                  <div class="card-body pb-0">
                    <div class="d-flex justify-content-between mb-0">
                      <div class="col-9">
                        <h5 class="font-weight-bold">${result[i].title}</h5>
                        <p>Rp.${result[i].price}</p>
                      </div>
                      <div class="col-3 d-flex align-items-baseline">
                        <i class="fas fa-tag text-grey mr-2"></i>
                        <p class="text-grey">${result[i].tag}</p>
                        <button class="fas fa-trash text-danger ml-auto cursor-pointer"  value="${result[i].id}"></button>
                      </div>
                    </div>
                    <div class="card-body border-bottom">
                      ${result[i].ingredients}
                    </div>
        
                  </div>
                </div>`);
            }
            $('.fas.fa-trash').click(function () {
                $.ajax({
                    url: 'http://localhost:3000/foods/' + $(this).val(),
                    method: 'DELETE',
                    headers: { access_token: localStorage.getItem('access_token') }
                })
                    .done(function (result) {
                        showListFoods();
                    })
                    .fail(function (result) {
                        console.log(result);
                        toastr.error(result.responseJSON.message, result.responseJSON.name)
                    });
            })
        })
        .fail(function (result) {
            console.log(result);
            toastr.error(result.responseJSON.message, result.responseJSON.name)
        });


    hideAll();
    $('#app-container').show();
}

function hideAll() {
    $('#login-container').hide();
    $('#app-container').hide();
}