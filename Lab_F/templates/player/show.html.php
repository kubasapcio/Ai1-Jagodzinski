<?php

/** @var \App\Model\Player $player */
/** @var \App\Service\Router $router */

$title = "{$player->getName()} ({$player->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $player->getName() ?></h1>
    <article>
        <p><strong>Pozycja:</strong> <?= $player->getPosition(); ?></p>
        <p><strong>Numer:</strong> <?= $player->getNumber(); ?></p>
        <p><strong>ID:</strong> <?= $player->getId(); ?></p>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('player-index') ?>">Powrót do listy</a></li>
        <li><a href="<?= $router->generatePath('player-edit', ['id'=> $player->getId()]) ?>">Edytuj</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';