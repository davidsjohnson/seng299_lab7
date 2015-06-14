//First App Code (Step 6)

angular.module('userApp', [])

.controller('mainController', function(){

	var vm = this;

	// basic variable to display
	vm.message ="SENG 299 Angular Tutorial"

		vm.students = [
		{first: "David", last: "Johnson"},
		{first: "Ernest", last: "Aaron"}
	];
});


// Declare app (Step 8)
<body class="container" ng-app="userApp" ng-controller="mainController as main">


// Student List with Repeat (step 9)
<!-- display the list using ng-repeat -->
<h2>Student List:</h2>
<table class="table table-bordered">
 <thead>
     <tr>
         <th>First Name</th>
         <th>Last Name</th>
     </tr>
 </thead>
 <tbody>
     <tr ng-repeat="student in main.students">
         <td>{{ student.first }}</td>
         <td>{{ student.last }}</td>
     </tr>
 </tbody>
</table>


// step 10
<!-- form to update the message variable using ng-model -->
<div class="form-group">
    <label>Message</label>
    <input type="text" class="form-control" ng-model="main.message">
</div>


// Step 11 (Add below existing list)

// information that comes from our form
vm.studentData = {};

//function to add student to list
vm.addStudent = function() {
    
    // add a computer to the list
    vm.students.push({
        first: vm.studentData.first,
        last: vm.studentData.last,
    });

    // after our computer has been added, clear the form
    vm.studentData = {};
};


// HTML Form
<!-- form to add computer to the list -->
 <form class="form-inline" ng-submit="main.addStudent()">  
     <input type="text" class="form-control" placeholder="First" ng-model="main.studentData.first">
     <input type="text" class="form-control" placeholder="Last" ng-model="main.studentData.last">
     <button type="submit" class="btn btn-success">Add</button>
 </form>




 // app.routes.js step13

 angular.module('app.routes', ['ngRoute'])

// Configuring the routes
.config(function($routeProvider, $locationProvider){

	$routeProvider

	// Route for home page
	.when("/", {
		templateUrl: 'app/views/pages/home.html',
		controller: 'mainController',
		controllerAs: 'main'
	});

	$locationProvider.html5Mode(true);
});



// Step 21
angular.module('userService', [])

.factory('User', function($http) {

	// create a new object
	var userFactory = {};

	// get a single user
	userFactory.get = function(id) {
		return $http.get('/api/users/' + id);
	};

	// get all users
	userFactory.all = function() {
		return $http.get('/api/users/');
	};

	userFactory.create = function(userData){
		return $http.post('/api/users', userData)	
	};
	
	return userFactory;

});


//step 29 user Controller.
angular.module('userCtrl', ['userService'])

.controller('userController', function(User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = data;
		});

})


// Step 35
//add create user controller
// controller applied to user creation page
.controller('userCreateController', function(User) {
	
	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the userService
		User.create(vm.userData)
			.success(function(data) {
				vm.processing = false;
				vm.userData = {};
				vm.message = data.message;
			});
			
	};	

});

//add a new edit user controller
	
	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});


// add function to delete user

	// function to delete a user
	vm.deleteUser = function(id) {
		vm.processing = true;

		User.delete(id)
			.success(function(data) {

				// get all users to update the table
				// you can also set up your api 
				// to return the list of users with the delete call
				User.all()
					.success(function(data) {
						vm.processing = false;
						vm.users = data;
					});

			});
	};