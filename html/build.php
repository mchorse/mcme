<?php

/**
 * Build HTML templates
 * 
 * Because I'm a really really lazy bastard, I decided to use PHP for 
 * assembling HTML templates. 
 * 
 * I was thinking about using JS based template engine, or something like this, 
 * but as I stated above, I'm lazy to do that, so I'll stick with PHP...
 * 
 * @author McHorse – laziest bastard
 */

ob_start(); 

require('layout.php');

file_put_contents(__DIR__ . '/../build/index.html', ob_get_clean());