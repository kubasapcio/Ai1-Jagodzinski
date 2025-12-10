<?php
    /** @var $player ?\App\Model\Post */
?>

<div class="form-group">
    <label for="name">Firstname and Lastname</label>
    <input type="text" id="name" name="player[name]" value="<?= $player ? $player->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="position">Position</label>
    <input id="position" name="player[position]" value="<?= $player? $player->getPosition() : '' ?>">
</div>

<div class="form-group">
    <label for="number">Number</label>
    <input type="number" id="number" name="player[number]" value="<?= $player ? $player->getNumber() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Zapisz">
</div>
