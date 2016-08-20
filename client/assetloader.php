<?php 

$dir = './assets/';

$assets = [];

foreach (new DirectoryIterator($dir) as $fileInfo) {
    if (!$fileInfo->isDot()) {
        array_push($assets, $fileInfo->getFilename());
        if ($fileInfo->isDir()) {
            listFolderFiles($fileInfo->getPathname());
        }
    }
}

echo implode(',', $assets);