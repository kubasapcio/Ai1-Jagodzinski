<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = 'Add player';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Add player</h1>
    <form action="<?= $router->generatePath('player-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="player-create">
    </form>

    <a href="<?= $router->generatePath('player-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
