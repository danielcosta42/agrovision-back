import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Middleware para validação de dados usando Joi com documentação Swagger
 */
export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Erro de validação',
        message: 'Dados inválidos fornecidos',
        details
      });
    }

    // Substitui req.body pelos dados validados e limpos
    req.body = value;
    next();
  };
};

/**
 * Middleware para validação de parâmetros de query
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: false
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Erro de validação',
        message: 'Parâmetros de consulta inválidos',
        details
      });
    }

    req.query = value;
    next();
  };
};

/**
 * Middleware para validação de parâmetros de rota
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Erro de validação',
        message: 'Parâmetros de rota inválidos',
        details
      });
    }

    req.params = value;
    next();
  };
};
