<?php
namespace App\Model;

use App\Service\Config;

class Player
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $position = null;
    private ?int $number = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Player
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Player
    {
        $this->name = $name;

        return $this;
    }

    public function getPosition(): ?string
    {
        return $this->position;
    }

    public function setPosition(?string $position): Player
    {
        $this->position = $position;

        return $this;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(?int $number): Player
    {
        $this->number = $number;

        return $this;
    }

    public static function fromArray($array): Player
    {
        $player = new self();
        $player->fill($array);

        return $player;
    }

    public function fill($array): Player
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['position'])) {
            $this->setPosition($array['position']);
        }
        if (isset($array['number'])) {
            $this->setNumber($array['number']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM player';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $players = [];
        $playersArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($playersArray as $playerArray) {
            $players[] = self::fromArray($playerArray);
        }

        return $players;
    }

    public static function find($id): ?Player
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM player WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $playerArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $playerArray) {
            return null;
        }
        $player = Player::fromArray($playerArray);

        return $player;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO player (name, position, number) VALUES (:name, :position, :number)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'position' => $this->getPosition(),
                'number' => $this->getNumber(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE player SET name = :name, position = :position, number = :number WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':position' => $this->getPosition(),
                ':number' => $this->getNumber(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM player WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setPosition(null);
        $this->setNumber(null);
    }
}