<?php

/** @var \App\Model\Player $player */
/** @var \App\Service\Router $router */

$title = "Edit player: {$player->getName()} ({$player->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>

    <form action="<?= $router->generatePath('player-edit', ['id' => $player->getId()]) ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="player-edit">
        <input type="hidden" name="id" value="<?= $player->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('player-index') ?>">Powrót do listy</a>
        </li>
        <li>
            <form action="<?= $router->generatePath('player-delete') ?>" method="post">
                <input type="submit" value="Usuń" onclick="return confirm('Czy na pewno chcesz usunąć tego piłkarza?')">
                <input type="hidden" name="action" value="player-delete">
                <input type="hidden" name="id" value="<?= $player->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';