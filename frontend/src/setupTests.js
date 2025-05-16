// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import fetch, { Request, Response, Headers } from 'node-fetch';

import { TextEncoder, TextDecoder } from 'util';

global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Polyfill for TextEncoder/TextDecoder if missing

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;