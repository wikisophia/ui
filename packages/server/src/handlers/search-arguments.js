import { query, validationResult } from 'express-validator';
import fetch from 'node-fetch';
import newClient from '@wikisophia/api-arguments-client';

const paramValidation = [
  query('search').exists().isString(),
];

function newHandler(config) {
  const {
    api: {
      url,
    },
    staticResources: {
      url: resourcesRoot,
    },
  } = config;
  const argumentsClient = newClient({
    url,
    fetch,
  });

  return function handler(req, res) {
    const { query: { search } } = req;
    if (!validationResult(req).isEmpty()) {
      res.status(400).contentType('text/plain').send('request missing required query parameter: search');
      return;
    }
    argumentsClient.getSome({ search }).then((args) => {
      res.contentType('text/html').render('search-arguments', {
        resourcesRoot,
        arguments: args.arguments,
        search,
      });
    }).catch((err) => {
      res.status(503).contentType('text/plain').send(`Failed to fetch from api-arguments: ${err.message}`);
    });
  };
}

export default function newAllArguments(config) {
  return [
    ...paramValidation,
    newHandler(config),
  ];
}
