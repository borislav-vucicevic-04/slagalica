import IAsocijacije from "./asocijacije.interface";
import IDesnoLijevo from "./desnoLijevo.interface";
import IMojBroj from "./mojBroj.interface";
import IParovi from "./parovi.interface";
import IPremetaljka from "./premetaljka.interface";
import IPutOkoSvijeta from "./putOkoSvijeta.interface";
import ISef from "./sef.interface";
import ISlagalica from "./slagalica.interface";
import ISpajalica from "./spajalica.interface";
import IZid from "./zid.interface";

export default interface IGame {
  slagalica: ISlagalica,
  spajalica: ISpajalica,
  desnoLijevo: IDesnoLijevo,
  zid: IZid,
  asocijacije: IAsocijacije,
  premetaljka: IPremetaljka,
  parovi: IParovi,
  mojBroj: IMojBroj,
  putOkoSvijeta: IPutOkoSvijeta[],
  sef: ISef,
}