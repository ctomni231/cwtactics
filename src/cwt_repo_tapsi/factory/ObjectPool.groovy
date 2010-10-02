@Typed
package cwt_repo_tapsi.factory

/**
 * Object pool class, provides a recycling serving for objects. Objects from
 * this pool will not deleted after check in, they will be reseted 
 * ( like recycled ) and will hold for next check out. 
 * This class allows unlimited instances in the pool.
 * This usage drops some safety mechanism, because it is designed to be 
 * used in games, so you need to use it correctly to prevent logical errors
 * in your application.
 * 
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 30.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
abstract class ObjectPool<T> 
{
	// collected objects
	private def List<T> unlocked
	
	ObjectPool() 
	{
		unlocked = []
	}
	
	/**
	 * Fills the pool with instances to a given size.
	 * 
	 * @param size size of instances
	 */
	final synchronized void initializeToSize( int size )
	{
		assert size > 0
				
		size -= unlocked.size
		
		size.times{ unlocked << create() }
	}
	
	/**
	 * Creates a new instance for the pool if no recycled object is
	 * available.
	 * 
	 * @return created object instance
	 */
	protected abstract T create();
	
	/**
	 * Recycles the object to bring it into a usable state.
	 * 
	 * @param t object instance
	 */
	protected abstract void recycle( T t );
	
	/**
	 * Acquires an object instance from this pool and sets it state into
	 * use able. 
	 * 
	 * @return object instance
	 */
	public synchronized T acquireInstance() 
	{
		if( unlocked.size() > 0 )
			return unlocked.pop()
		else
			return create()
	}
	
	/**
	 * Releases an used object back into the object pool.
	 * 
	 * @param t object instance
	 */
	public synchronized void releaseInstance(T t) 
	{
		assert t
		
		recycle t
		unlocked.push t
	}
}
