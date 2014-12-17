package net.wolfTec.types;

import net.wolfTec.Constants;
import net.wolfTec.utility.Debug;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;

/**
 * A data object that holds a list of sheet objects with a given schema. Every sheet that will be added to the
 * data object will be validated first.
 */
public abstract class Database<T extends ObjectType> {

    public static final String LOG_HEADER = Constants.LOG_TYPE_DATABASE;

    /**
     * Holds all type sheet objects.
     */
    private Map<String, T> sheets;

    /**
     * Holds all type names.
     */
    private Array<String> types;

    public Database() {
        this.types = JSCollections.$array();
        this.sheets = JSObjectAdapter.$object(null);
    }

    public void registerSheetByString(String data) {
        registerSheetByObject(parseJSON(data));
    }

    public void registerSheetByObject(T type) {
        Debug.logInfo(LOG_HEADER, "Validating sheet " + type.ID);
        type.validate();

        Debug.logInfo(LOG_HEADER, "Register sheet with ID " + type.ID);
        this.sheets.$put(type.ID, type);
        this.types.push(type.ID);
    }

    public abstract T parseJSON(String data);

    /**
     * @param sheetId id of the sheet
     * @return sheet object
     */
    public T getSheet(String sheetId) {
        return sheets.$get(sheetId);
    }

    /**
     * @returns {Array}
     */
    public Array<String> getIdList() {
        return types;
    }

    /**
     * @param id
     * @returns {*|boolean}
     */
    public boolean isValidType(String id) {
        return JSObjectAdapter.hasOwnProperty(sheets, id);
    }
}
