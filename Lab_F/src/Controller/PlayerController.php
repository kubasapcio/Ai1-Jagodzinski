<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Player;
use App\Service\Router;
use App\Service\Templating;

class PlayerController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $players = Player::findAll();
        $html = $templating->render('player/index.html.php', [
            'players' => $players,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPlayer, Templating $templating, Router $router): ?string
    {
        if ($requestPlayer) {
            // Tworzymy obiekt na podstawie danych z formularza
            $player = Player::fromArray($requestPlayer);
            $player->save();

            $path = $router->generatePath('player-index');
            $router->redirect($path);
            return null;
        } else {
            $player = new Player();
        }

        $html = $templating->render('player/create.html.php', [
            'player' => $player,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $playerId, ?array $requestPlayer, Templating $templating, Router $router): ?string
    {
        $player = Player::find($playerId);
        if (! $player) {
            throw new NotFoundException("Missing player with id $playerId");
        }

        if ($requestPlayer) {
            $player->fill($requestPlayer);
            $player->save();

            $path = $router->generatePath('player-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('player/edit.html.php', [
            'player' => $player,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $playerId, Templating $templating, Router $router): ?string
    {
        $player = Player::find($playerId);
        if (! $player) {
            throw new NotFoundException("Missing player with id $playerId");
        }

        $html = $templating->render('player/show.html.php', [
            'player' => $player,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $playerId, Router $router): ?string
    {
        $player = Player::find($playerId);
        if (! $player) {
            throw new NotFoundException("Missing player with id $playerId");
        }

        $player->delete();
        $path = $router->generatePath('player-index');
        $router->redirect($path);
        return null;
    }
}