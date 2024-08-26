import React, { Component } from "react";

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center bg-light text-dark">
	<p className="mb-0">
		Crafted by gamers, for gamers. United by passion!
	</p>
	<div className="social-media mt-2">
		<a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">
			<i className="fab fa-twitter"></i> Twitter
		</a>
		<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
			<i className="fab fa-facebook-f"></i> Facebook
		</a>
		<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2">
			<i className="fab fa-instagram"></i> Instagram
		</a>
	</div>
</footer>
);