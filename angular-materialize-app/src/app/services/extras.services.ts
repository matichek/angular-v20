import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { Observable } from "rxjs";
import { Extra } from "../models/extras.model";

@Injectable({
  providedIn: "root",
})
export class ExtrasService {
  private extrasUrl = "assets/data/extras.json";

  constructor(private http: HttpClient) {}

  getExtras(): Observable<Extra[]> {
    return this.http.get<Extra[]>(this.extrasUrl);
  }
}
