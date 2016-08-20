<?php 

$dir = '.\assets\\';

$assets = [];

$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir), RecursiveIteratorIterator::SELF_FIRST );

foreach ( $iterator as $path ) {
    if (!$path->isDir()) {
    	array_push($assets, str_replace($dir, '', $path) );
    }
}

echo implode(',', $assets);