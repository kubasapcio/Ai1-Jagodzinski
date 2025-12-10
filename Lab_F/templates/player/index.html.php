<?php

/** @var \App\Model\Player[] $players */
/** @var \App\Service\Router $router */

$title = 'Lista Piłkarzy';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Lista Piłkarzy</h1>

    <a href="<?= $router->generatePath('player-create') ?>">Dodaj nowego</a>

    <ul class="index-list">
        <?php foreach ($players as $player): ?>
            <li>
                <h3><?= $player->getName() ?></h3>

                <div>
                    Pozycja: <?= $player->getPosition() ?>,
                    Numer: <?= $player->getNumber() ?>
                </div>

                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('player-show', ['id' => $player->getId()]) ?>">Szczegóły</a></li>
                    <li><a href="<?= $router->generatePath('player-edit', ['id' => $player->getId()]) ?>">Edytuj</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';