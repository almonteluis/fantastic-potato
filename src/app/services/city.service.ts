import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError } from "rxjs";
import { City } from "../models/city.model";
import { environment } from '../../envi'