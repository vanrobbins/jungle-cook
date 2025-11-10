export const html = `
<div id="login">
	<div class="login-forms" id="loginForm">
		<h1 class="fontCaveat">Login Here!</h1>
		<label for="login-email">Email</label>
		<input id="login-email" type="email" placeholder="jungle@cook.org" />
		<label for="login-pass">Password</label>
		<input id="login-pass" type="password" placeholder="bestCook123" />
		<button id="login-btn">Log In</button>
	</div>
	<div class="login-forms" id="signupForm">
		<span>don't have an account?</span>
		<h1 class="fontCaveat">Sign Up!</h1>
		<label for="signup-fName">First Name</label>
		<input id="signup-fName" type="text" placeholder="Jungle" />
		<label for="signup-lName">Last Name</label>
		<input id="signup-lName" type="text" placeholder="Cook" />
		<label for="signup-email">Email</label>
		<input id="signup-email" type="email" placeholder="jungle@cook.org" />
		<label for="signup-pass">Password</label>
		<input id="signup-pass" type="password" placeholder="bestCook123" />
		<button id="signup-btn">Sign Up</button>
	</div>
</div>
`;
