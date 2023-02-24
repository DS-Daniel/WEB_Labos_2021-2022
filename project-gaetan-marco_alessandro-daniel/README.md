# Rapport Projet - Space Shooter

#### Gaétan Zwick | Daniel Sciarra | Alessandro Parrino | Marco Maziero

##### Date :24/01/2022

<img width="1440" alt="Capture d’écran 2022-01-24 à 15 05 59" src="https://user-images.githubusercontent.com/25340549/150797492-b2cafe80-b814-4064-9dd7-c6b38cbfd4ff.png">

# Introduction

L'application est un jeu de tir spatial ou les joueurs évoluent dans un monde en 3D. L'objectif est de détruire le vaisseau de tous les autres joueurs.
# Fonctionnalités

La base du projet reprend celle du labo précédent (6), mais les fonctionnalités suivantes ont été ajoutées.

#### - Création d'un environnement de jeu en 3D avec three.js

Le rendu visuel du jeu originel (2D) a été complètement changé pour obtenir un rendu en 3D.

#### - Chargement de modèles 3D

Utilisation de three.js pour importer et afficher des modèles 3D de vaisseaux et astéroïdes.

#### - Caméra en troisième personne

La caméra se place derrière le vaisseau et se déplace avec lui. 

#### - Astéroïdes

Les astéroïdes sont des modèles 3D tournant sur eux même et bloquant la vision des joueurs. Ils servent aussi de repères pour le déplacement dans l'environnement 3D.

De plus, lorsqu'un missile rentre en contact avec un astéroïde, sa trajectoire va être déviée afin de pimenter la partie.

### - UI

Petite interface indiquant le niveau de vie de tous les joueurs.

#### - Power ups

Des power ups en forme de coeurs sont présents dans le jeu et permettent de récupérer un point de vie. Les power ups réapparaissent à un emplacement aléatoire après avoir été récupérés par un joueur.
