package content

import "errors"

var (
	ErrNotFound   = errors.New("content item not found")
	ErrValidation = errors.New("validation failed")
)

type ValidationError struct {
	Message string
}

func (e ValidationError) Error() string {
	return e.Message
}

func validationError(message string) error {
	return ValidationError{Message: message}
}
