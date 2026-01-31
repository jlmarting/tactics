export interface IRenderer<T>{

    /**
     * Renderiza elementos en medio correspondiente
     * @param items elementos a mostrar en el medio
     * @returns tiempo en ms con precisión decimal
     */
    render(items: T[]): number;

    /**
     * Inicializa el medio, limpia de items renderizados
     */
    clear(): void;
}