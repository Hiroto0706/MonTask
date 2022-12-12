package models

import (
	"log"
	"time"
)

type User struct {
	ID        int       `json:"id"`
	UUID      string    `json:"uuid"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

func (u *User) CreateUser() (err error) {
	cmd := `insert into users (
		uuid,
		email, 
		created_at) values ($1, $2, $3)`

	_, err = Db.Exec(cmd, createUUID(), u.Email, time.Now())
	if err != nil {
		log.Fatalln(err)
	}

	return err
}

func GetUserByEmail(email string) (user *User, err error) {
	user = &User{}
	cmd := `select id, uuid, email, created_at from users where email = $1`
	err = Db.QueryRow(cmd, email).Scan(
		&user.ID,
		&user.UUID,
		&user.Email,
		&user.CreatedAt)

	return user, err
}

func GetUserById(id int) (user *User, err error) {
	user = &User{}
	cmd := `select id, uuid, email, created_at from users where id = $1`
	err = Db.QueryRow(cmd, id).Scan(
		&user.ID,
		&user.UUID,
		&user.Email,
		&user.CreatedAt)

	return user, err
}

func GetUser(id int) (user User, err error) {
	user = User{}
	cmd := `select id, uuid, email, created_at from users where id = $1`
	err = Db.QueryRow(cmd, id).Scan(
		&user.ID,
		&user.UUID,
		&user.Email,
		&user.CreatedAt)

	return user, err
}
